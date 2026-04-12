#!/bin/bash

# ============================================
# SriMatch Database Restore Script
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_FILE=$1
RESTORE_DIR="/tmp/srimatch_restore"

if [ -z "${BACKUP_FILE}" ]; then
    echo -e "${RED}Usage: $0 <backup_file.tar.gz>${NC}"
    echo "Available backups:"
    ls -lh /var/backups/srimatch/*.tar.gz 2>/dev/null || echo "No backups found"
    exit 1
fi

if [ ! -f "${BACKUP_FILE}" ]; then
    echo -e "${RED}Backup file not found: ${BACKUP_FILE}${NC}"
    exit 1
fi

echo -e "${RED}========================================${NC}"
echo -e "${RED}WARNING: This will overwrite current data!${NC}"
echo -e "${RED}========================================${NC}"
read -p "Are you sure you want to restore from ${BACKUP_FILE}? (yes/no): " CONFIRM

if [ "${CONFIRM}" != "yes" ]; then
    echo -e "${YELLOW}Restore cancelled.${NC}"
    exit 0
fi

echo -e "${GREEN}Starting restore from ${BACKUP_FILE}...${NC}"

# Create restore directory
mkdir -p ${RESTORE_DIR}

# Extract backup
echo -e "${YELLOW}Extracting backup archive...${NC}"
tar -xzf ${BACKUP_FILE} -C ${RESTORE_DIR}

# Stop applications
echo -e "${YELLOW}Stopping applications...${NC}"
docker-compose down

# Restore database
echo -e "${YELLOW}Restoring database...${NC}"
DATABASE_FILE=$(ls ${RESTORE_DIR}/database_*.sql.gz | head -1)

if [ -f "${DATABASE_FILE}" ]; then
    docker start srimatch-mysql
    sleep 5

    gunzip -c ${DATABASE_FILE} | docker exec -i srimatch-mysql mysql -u${DB_USERNAME} -p${DB_PASSWORD} srimatch_db

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}Database restore successful${NC}"
    else
        echo -e "${RED}Database restore failed!${NC}"
        exit 1
    fi
fi

# Restore uploaded files
echo -e "${YELLOW}Restoring uploaded files...${NC}"
UPLOADS_FILE=$(ls ${RESTORE_DIR}/uploads_*.tar.gz | head -1)

if [ -f "${UPLOADS_FILE}" ]; then
    tar -xzf ${UPLOADS_FILE} -C /
    echo -e "${GREEN}Files restore successful${NC}"
fi

# Restore Redis
echo -e "${YELLOW}Restoring Redis data...${NC}"
REDIS_FILE=$(ls ${RESTORE_DIR}/redis_*.rdb | head -1)

if [ -f "${REDIS_FILE}" ]; then
    docker start srimatch-redis
    sleep 3
    docker cp ${REDIS_FILE} srimatch-redis:/data/dump.rdb
    docker exec srimatch-redis redis-cli SHUTDOWN NOSAVE
    docker start srimatch-redis
    echo -e "${GREEN}Redis restore successful${NC}"
fi

# Restart applications
echo -e "${YELLOW}Restarting applications...${NC}"
docker-compose up -d

# Clear cache
echo -e "${YELLOW}Clearing cache...${NC}"
docker exec srimatch-redis redis-cli FLUSHALL

# Health check
echo -e "${YELLOW}Performing health check...${NC}"
sleep 10

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/actuator/health)

if [ ${HTTP_STATUS} -eq 200 ]; then
    echo -e "${GREEN}Health check passed!${NC}"
else
    echo -e "${RED}Health check failed! Please check logs.${NC}"
    docker-compose logs --tail=50
    exit 1
fi

# Clean up
echo -e "${YELLOW}Cleaning up...${NC}"
rm -rf ${RESTORE_DIR}

# Send notification
curl -X POST -H "Content-Type: application/json" \
    -d "{\"text\":\"🔄 SriMatch Database Restore Completed\\nBackup: ${BACKUP_FILE}\\nTime: $(date)\"}" \
    ${SLACK_WEBHOOK_URL} || true

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Restore completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"