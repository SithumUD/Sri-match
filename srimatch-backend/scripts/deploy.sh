#!/bin/bash

# ============================================
# SriMatch Production Deployment Script
# ============================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
APP_NAME="srimatch"
APP_VERSION=$(mvn help:evaluate -Dexpression=project.version -q -DforceStdout)
DOCKER_REGISTRY="registry.srimatch.com"
DEPLOY_ENV=${1:-production}
BACKUP_DIR="/var/backups/srimatch"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SriMatch Deployment - Environment: ${DEPLOY_ENV}${NC}"
echo -e "${GREEN}Version: ${APP_VERSION}${NC}"
echo -e "${GREEN}========================================${NC}"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command_exists docker; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

if ! command_exists docker-compose; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

if ! command_exists java; then
    echo -e "${RED}Java is not installed. Please install Java 17 or later.${NC}"
    exit 1
fi

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Backup current database
echo -e "${YELLOW}Backing up database...${NC}"
BACKUP_FILE="${BACKUP_DIR}/srimatch_db_$(date +%Y%m%d_%H%M%S).sql.gz"

docker exec srimatch-mysql mysqldump -u${DB_USERNAME} -p${DB_PASSWORD} srimatch_db | gzip > ${BACKUP_FILE}

if [ $? -eq 0 ]; then
    echo -e "${GREEN}Database backup created: ${BACKUP_FILE}${NC}"
else
    echo -e "${RED}Database backup failed!${NC}"
    exit 1
fi

# Run Flyway migrations
echo -e "${YELLOW}Running database migrations...${NC}"
mvn flyway:migrate -Dflyway.configFiles=flyway.conf

if [ $? -ne 0 ]; then
    echo -e "${RED}Migration failed! Rolling back...${NC}"
    mvn flyway:undo
    exit 1
fi

# Build the application
echo -e "${YELLOW}Building application...${NC}"
mvn clean package -DskipTests -P${DEPLOY_ENV}

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

# Build Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t ${APP_NAME}:${APP_VERSION} .
docker tag ${APP_NAME}:${APP_VERSION} ${DOCKER_REGISTRY}/${APP_NAME}:${APP_VERSION}
docker tag ${APP_NAME}:${APP_VERSION} ${DOCKER_REGISTRY}/${APP_NAME}:latest

# Push to registry
echo -e "${YELLOW}Pushing to Docker registry...${NC}"
docker push ${DOCKER_REGISTRY}/${APP_NAME}:${APP_VERSION}
docker push ${DOCKER_REGISTRY}/${APP_NAME}:latest

# Deploy with Docker Compose
echo -e "${YELLOW}Deploying with Docker Compose...${NC}"
docker-compose down
docker-compose pull
docker-compose up -d

# Wait for application to start
echo -e "${YELLOW}Waiting for application to start...${NC}"
sleep 10

# Health check
echo -e "${YELLOW}Performing health check...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0

while [ ${RETRY_COUNT} -lt ${MAX_RETRIES} ]; do
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/api/actuator/health)

    if [ ${HTTP_STATUS} -eq 200 ]; then
        echo -e "${GREEN}Health check passed!${NC}"
        break
    fi

    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -e "${YELLOW}Health check attempt ${RETRY_COUNT}/${MAX_RETRIES}...${NC}"
    sleep 5
done

if [ ${RETRY_COUNT} -eq ${MAX_RETRIES} ]; then
    echo -e "${RED}Health check failed!${NC}"
    docker-compose logs --tail=50
    exit 1
fi

# Clear cache
echo -e "${YELLOW}Clearing cache...${NC}"
docker exec srimatch-redis redis-cli FLUSHALL

# Send deployment notification
echo -e "${YELLOW}Sending deployment notification...${NC}"
curl -X POST -H "Content-Type: application/json" \
    -d "{\"text\":\"✅ SriMatch ${DEPLOY_ENV} deployment successful!\\nVersion: ${APP_VERSION}\\nTime: $(date)\"}" \
    ${SLACK_WEBHOOK_URL} || true

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}========================================${NC}"

# Display deployment info
echo -e "\n${GREEN}Deployment Information:${NC}"
echo -e "  Application: ${APP_NAME}"
echo -e "  Version: ${APP_VERSION}"
echo -e "  Environment: ${DEPLOY_ENV}"
echo -e "  Deployed at: $(date)"
echo -e "\n  Access the application at: https://srimatch.com"
echo -e "  API Documentation: https://api.srimatch.com/api/swagger-ui.html"
echo -e "\n  View logs: docker-compose logs -f"