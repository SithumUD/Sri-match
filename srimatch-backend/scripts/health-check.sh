#!/bin/bash

# ============================================
# SriMatch Health Check Script
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
API_URL="https://api.srimatch.com/api"
CHECK_INTERVAL=30
FAILURE_THRESHOLD=3
FAILURE_COUNT=0

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}SriMatch Health Check Started at $(date)${NC}"
echo -e "${GREEN}========================================${NC}"

# Function to check API health
check_api_health() {
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${API_URL}/actuator/health)
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" ${API_URL}/actuator/health)

    if [ ${HTTP_CODE} -eq 200 ]; then
        echo -e "${GREEN}✓ API Health Check: OK (${RESPONSE_TIME}s)${NC}"
        return 0
    else
        echo -e "${RED}✗ API Health Check: FAILED (HTTP ${HTTP_CODE})${NC}"
        return 1
    fi
}

# Function to check database connectivity
check_database() {
    DB_STATUS=$(docker exec srimatch-mysql mysqladmin -u${DB_USERNAME} -p${DB_PASSWORD} ping 2>/dev/null)

    if [ "$DB_STATUS" = "mysqld is alive" ]; then
        echo -e "${GREEN}✓ Database: Connected${NC}"
        return 0
    else
        echo -e "${RED}✗ Database: Disconnected${NC}"
        return 1
    fi
}

# Function to check Redis
check_redis() {
    REDIS_PONG=$(docker exec srimatch-redis redis-cli PING 2>/dev/null)

    if [ "$REDIS_PONG" = "PONG" ]; then
        echo -e "${GREEN}✓ Redis: Connected${NC}"
        return 0
    else
        echo -e "${RED}✗ Redis: Disconnected${NC}"
        return 1
    fi
}

# Function to check disk space
check_disk_space() {
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

    if [ ${DISK_USAGE} -lt 85 ]; then
        echo -e "${GREEN}✓ Disk Space: ${DISK_USAGE}% used${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Disk Space: ${DISK_USAGE}% used (critical)${NC}"
        return 1
    fi
}

# Function to check memory usage
check_memory() {
    MEM_USAGE=$(free | grep Mem | awk '{print ($3/$2) * 100.0}' | cut -d. -f1)

    if [ ${MEM_USAGE} -lt 90 ]; then
        echo -e "${GREEN}✓ Memory: ${MEM_USAGE}% used${NC}"
        return 0
    else
        echo -e "${RED}✗ Memory: ${MEM_USAGE}% used (critical)${NC}"
        return 1
    fi
}

# Function to check CPU load
check_cpu() {
    CPU_LOAD=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d. -f1)

    if [ ${CPU_LOAD:-0} -lt 80 ]; then
        echo -e "${GREEN}✓ CPU Load: ${CPU_LOAD}%${NC}"
        return 0
    else
        echo -e "${RED}✗ CPU Load: ${CPU_LOAD}% (high)${NC}"
        return 1
    fi
}

# Function to check SSL certificate
check_ssl() {
    SSL_EXPIRY=$(echo | openssl s_client -servername srimatch.com -connect srimatch.com:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
    EXPIRY_EPOCH=$(date -d "${SSL_EXPIRY}" +%s)
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))

    if [ ${DAYS_LEFT} -gt 30 ]; then
        echo -e "${GREEN}✓ SSL Certificate: Valid (expires in ${DAYS_LEFT} days)${NC}"
        return 0
    elif [ ${DAYS_LEFT} -gt 7 ]; then
        echo -e "${YELLOW}⚠ SSL Certificate: Expires in ${DAYS_LEFT} days${NC}"
        return 0
    else
        echo -e "${RED}✗ SSL Certificate: Expires in ${DAYS_LEFT} days (critical)${NC}"
        return 1
    fi
}

# Function to check Docker containers
check_containers() {
    FAILED_CONTAINERS=$(docker ps -a --filter "status=exited" --filter "status=dead" --format "table {{.Names}}" | tail -n +2)

    if [ -z "${FAILED_CONTAINERS}" ]; then
        echo -e "${GREEN}✓ Docker Containers: All running${NC}"
        return 0
    else
        echo -e "${RED}✗ Docker Containers: Failed containers detected${NC}"
        echo "${FAILED_CONTAINERS}"
        return 1
    fi
}

# Run all checks
echo -e "\n${YELLOW}Running health checks...${NC}\n"

check_api_health
API_RESULT=$?

check_database
DB_RESULT=$?

check_redis
REDIS_RESULT=$?

check_disk_space
DISK_RESULT=$?

check_memory
MEM_RESULT=$?

check_cpu
CPU_RESULT=$?

check_ssl
SSL_RESULT=$?

check_containers
CONTAINER_RESULT=$?

# Calculate overall status
TOTAL_CHECKS=8
PASSED_CHECKS=0

[ ${API_RESULT} -eq 0 ] && ((PASSED_CHECKS++))
[ ${DB_RESULT} -eq 0 ] && ((PASSED_CHECKS++))
[ ${REDIS_RESULT} -eq 0 ] && ((PASSED_CHECKS++))
[ ${DISK_RESULT} -eq 0 ] && ((PASSED_CHECKS++))
[ ${MEM_RESULT} -eq 0 ] && ((PASSED_CHECKS++))
[ ${CPU_RESULT} -eq 0 ] && ((PASSED_CHECKS++))
[ ${SSL_RESULT} -eq 0 ] && ((PASSED_CHECKS++))
[ ${CONTAINER_RESULT} -eq 0 ] && ((PASSED_CHECKS++))

HEALTH_SCORE=$(( (PASSED_CHECKS * 100) / TOTAL_CHECKS ))

echo -e "\n${YELLOW}Health Score: ${HEALTH_SCORE}% (${PASSED_CHECKS}/${TOTAL_CHECKS} checks passed)${NC}"

# Determine overall health
if [ ${HEALTH_SCORE} -eq 100 ]; then
    echo -e "${GREEN}✓ System Health: HEALTHY${NC}"
    exit 0
elif [ ${HEALTH_SCORE} -ge 75 ]; then
    echo -e "${YELLOW}⚠ System Health: DEGRADED${NC}"

    # Send alert for degraded health
    curl -X POST -H "Content-Type: application/json" \
        -d "{\"text\":\"⚠️ SriMatch System Degraded\\nHealth Score: ${HEALTH_SCORE}%\\nTime: $(date)\"}" \
        ${SLACK_WEBHOOK_URL} || true

    exit 1
else
    echo -e "${RED}✗ System Health: UNHEALTHY${NC}"

    # Send critical alert
    curl -X POST -H "Content-Type: application/json" \
        -d "{\"text\":\"🚨 CRITICAL: SriMatch System Unhealthy!\\nHealth Score: ${HEALTH_SCORE}%\\nTime: $(date)\\nAction Required Immediately!\"}" \
        ${SLACK_WEBHOOK_URL} || true

    # Restart unhealthy containers if needed
    if [ ${CONTAINER_RESULT} -ne 0 ]; then
        echo -e "${YELLOW}Attempting to restart failed containers...${NC}"
        docker-compose restart
    fi

    exit 2
fi