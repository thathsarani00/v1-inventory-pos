# Inventory Management System - Backend

Spring Boot backend for the Inventory Management System.

## Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **Spring Security**
- **MySQL Database**
- **Maven**
- **Lombok**

## Prerequisites

- Java JDK 17 or higher
- Maven 3.6+
- MySQL 8.0+

## Setup Instructions

### 1. Database Configuration

Create a MySQL database:

```sql
CREATE DATABASE inventory_db;
```

### 2. Configure Database Connection

Edit `src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/inventory_db
    username: your_username
    password: your_password
```

### 3. Build and Run

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080/api`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/search?name={name}` - Search products
- `GET /api/products/category/{category}` - Get products by category

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

## Project Structure

```
src/
├── main/
│   ├── java/com/inventory/backend/
│   │   ├── config/           # Configuration classes
│   │   ├── controller/       # REST controllers
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── exception/        # Exception handlers
│   │   ├── model/            # Entity models
│   │   ├── repository/       # JPA repositories
│   │   ├── security/         # Security configuration
│   │   └── service/          # Business logic services
│   └── resources/
│       ├── application.yml   # Main configuration
│       └── application-dev.yml # Development profile
└── test/                     # Test files
```

## Features

- ✅ RESTful API architecture
- ✅ JPA/Hibernate ORM
- ✅ Spring Security
- ✅ Password encryption with BCrypt
- ✅ CORS configuration
- ✅ Global exception handling
- ✅ DTO pattern
- ✅ Layered architecture (Controller → Service → Repository)

## Development Profile

To run with H2 in-memory database for development:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

H2 Console: `http://localhost:8080/api/h2-console`

## Testing

```bash
mvn test
```

## Build for Production

```bash
mvn clean package
java -jar target/backend-1.0.0.jar
```

## Environment Variables

You can override configuration using environment variables:

- `DB_URL` - Database URL
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `SERVER_PORT` - Server port (default: 8080)

## License

MIT
