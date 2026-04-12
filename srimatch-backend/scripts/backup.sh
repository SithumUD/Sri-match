#!/bin/bash

# ============================================
# SriMatch Database Backup Script
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_DIR="/var/backups/srimatch"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/srimatch_full_backup_${DATE}.tar.gz"
LOG_FILE="${BACKUP_DIR}/backup_${DATE}.log"

# Load environment variables
source /etc/srimatch/.env

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Start logging
exec > >(tee -a ${LOG_FILE}) 2>&1

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SriMatch Backup Started at $(date)${NC}"
echo -e "${GREEN}========================================${NC}"

# 1. Backup MySQL Database
echo -e "${YELLOW}Backing up MySQL database...${NC}"

docker exec srimatch-mysql mysqldump \
    --single-transaction \
    --quick \
    --lock-tables=false \
    --routines \
    --triggers \
    --events \
    -u${DB_USERNAME} \
    -p${DB_PASSWORD} \
    srimatch_db | gzip > ${BACKUP_DIR}/database_${DATE}.sql.gz

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Database backup successful${NC}"
    DB_SIZE=$(du -h ${BACKUP_DIR}/database_${DATE}.sql.gz | cut -f1)
    echo "Database backup size: ${DB_SIZE}"
else
    echo -e "${RED}Database backup failed!${NC}"
    exit 1
fi

# 2. Backup Uploaded Files
echo -e "${YELLOW}Backing up uploaded files...${NC}"

tar -czf ${BACKUP_DIR}/uploads_${DATE}.tar.gz /var/data/srimatch/uploads/ 2>/dev/null || true

if [ -f ${BACKUP_DIR}/uploads_${DATE}.tar.gz ]; then
    echo -e "${GREEN}Files backup successful${NC}"
    FILES_SIZE=$(du -h ${BACKUP_DIR}/uploads_${DATE}.tar.gz | cut -f1)
    echo "Files backup size: ${FILES_SIZE}"
fi

# 3. Backup Redis Data
echo -e "${YELLOW}Backing up Redis data...${NC}"

docker exec srimatch-redis redis-cli SAVE
docker cp srimatch-redis:/data/dump.rdb ${BACKUP_DIR}/redis_${DATE}.rdb

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Redis backup successful${NC}"
fi

# 4. Backup Configuration
echo -e "${YELLOW}Backing up configuration...${NC}"

tar -czf ${BACKUP_DIR}/config_${DATE}.tar.gz \
    /etc/srimatch/ \
    /etc/ssl/srimatch/ \
    /etc/nginx/sites-available/srimatch \
    2>/dev/null || true

# 5. Create combined backup archive
echo -e "${YELLOW}Creating combined backup archive...${NC}"

tar -czf ${BACKUP_FILE} \
    -C ${BACKUP_DIR} \
    database_${DATE}.sql.gz \
    uploads_${DATE}.tar.gz \
    redis_${DATE}.rdb \
    config_${DATE}.tar.gz \
    2>/dev/null

if [ -f ${BACKUP_FILE} ]; then
    echo -e "${GREEN}Combined backup created: ${BACKUP_FILE}${NC}"
    BACKUP_SIZE=$(du -h ${BACKUP_FILE} | cut -f1)
    echo "Total backup size: ${BACKUP_SIZE}"
fi

# 6. Upload to Cloud Storage (AWS S3)
echo -e "${YELLOW}Uploading to AWS S3...${NC}"

if command_exists aws; then
    aws s3 cp ${BACKUP_FILE} s3://srimatch-backups/${DEPLOY_ENV}/ \
        --storage-class STANDARD_IA

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Upload to S3 successful${NC}"
    else
        echo -e "${RED}Upload to S3 failed${NC}"
    fi
fi

# 7. Clean up old backups
echo -e "${YELLOW}Cleaning up old backups (older than ${RETENTION_DAYS} days)...${NC}"

find ${BACKUP_DIR} -name "*.tar.gz" -type f -mtime +${RETENTION_DAYS} -delete
find ${BACKUP_DIR} -name "*.sql.gz" -type f -mtime +${RETENTION_DAYS} -delete
find ${BACKUP_DIR} -name "*.tar.gz" -type f -mtime +${RETENTION_DAYS} -delete
find ${BACKUP_DIR} -name "*.rdb" -type f -mtime +${RETENTION_DAYS} -delete
find ${BACKUP_DIR} -name "*.log" -type f -mtime +${RETENTION_DAYS} -delete

echo -e "${GREEN}Cleanup completed${NC}"

# 8. Send notification
echo -e "${YELLOW}Sending backup notification...${NC}"

curl -X POST -H "Content-Type: application/json" \
    -d "{\"text\":\"✅ SriMatch Database Backup Completed\\nDate: $(date)\\nSize: ${BACKUP_SIZE}\\nLocation: s3://srimatch-backups/${DEPLOY_ENV}/\"}" \
    ${SLACK_WEBHOOK_URL} || true

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Backup completed successfully at $(date)${NC}"
echo -e "${GREEN}========================================${NC}"

# Display backup summary
echo -e "\n${GREEN}Backup Summary:${NC}"
echo "  Backup File: ${BACKUP_FILE}"
echo "  Backup Size: ${BACKUP_SIZE}"
echo "  Log File: ${LOG_FILE}"
echo "  Retention: ${RETENTION_DAYS} days"
echo "  Cloud Storage: s3://srimatch-backups/${DEPLOY_ENV}/"