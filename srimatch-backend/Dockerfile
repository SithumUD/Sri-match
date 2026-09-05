# ============================================
# Stage 1: Build the Application
# ============================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /build

# Copy pom.xml and resolve dependencies
COPY pom.xml .
RUN mvn dependency:resolve -B || true

# Copy source code and package application
COPY src ./src
RUN mvn clean package -DskipTests -B

# ============================================
# Stage 2: Minimal Runtime Image
# ============================================
FROM eclipse-temurin:21-jre-alpine

# Add metadata
LABEL maintainer="SriMatch Engineering <contact@srimatch.com>"
LABEL description="SriMatch Matrimonial Platform Backend Service"

# Create a non-root system user and group for security
RUN addgroup -S srimatch && adduser -S srimatch -G srimatch

# Set working directory
WORKDIR /app

# Create upload and log directories with correct permissions
RUN mkdir -p /app/uploads /app/logs && chown -R srimatch:srimatch /app

# Copy the built jar from builder stage
COPY --from=builder --chown=srimatch:srimatch /build/target/srimatch-*.jar /app/srimatch.jar

# Switch to non-root user
USER srimatch

# Configure environment variables
ENV SPRING_PROFILES_ACTIVE=prod \
    JAVA_OPTS="-XX:+UseG1GC -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

# Expose Spring Boot port
EXPOSE 8080

# Health check using Actuator
HEALTHCHECK --interval=30s --timeout=5s --start-period=45s --retries=3 \
    CMD wget -qO- http://localhost:8080/api/actuator/health | grep -q "UP" || exit 1

# Execute the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar /app/srimatch.jar"]
