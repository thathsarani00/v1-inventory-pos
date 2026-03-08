# Multi-stage Dockerfile for Single Application (Frontend + Backend)

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend

# Copy frontend package files (from root context)
COPY react/template/package*.json ./
RUN npm install

# Copy frontend source and build
COPY react/template/ ./
RUN npm run build

# Stage 2: Build Backend
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app

# Copy pom.xml and download dependencies (from root context)
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B

# Copy backend source
COPY backend/src ./src

# Copy frontend build from stage 1
COPY --from=frontend-build /frontend/dist ./src/main/resources/static/

# Build backend JAR
RUN mvn clean package -DskipTests -B

# Stage 3: Run Application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy jar from build stage
COPY --from=backend-build /app/target/*.jar app.jar

# Expose port
EXPOSE 5555

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5555/v1/products || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
