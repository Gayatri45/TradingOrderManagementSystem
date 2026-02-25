# 24Markets - Real-Time Trading Platform

A comprehensive full-stack trading platform with Spring Boot backend, React + Vite frontend, JWT authentication, and Redis caching for market data. Users can register, authenticate, browse markets, place orders, and manage their trading portfolio.

---

## Project Overview

**24Markets** is a modern, production-ready trading platform that enables users to:
- Register and authenticate with JWT-based security
- Browse live market data (cached with Redis for performance)
- Place buy/sell orders in real-time
- Track order history and status
- Manage wallet balance and profile
- Admin dashboard for managing users, markets, and all orders

---

## Tech Stack

### Backend
- **Framework:** Spring Boot 3.1.5
- **Language:** Java 11+
- **Build Tool:** Maven
- **Database:** MySQL 8.0
- **Caching:** Redis Cloud (remote)
- **Security:** Spring Security + JWT (JJWT 0.12.3)
- **ORM:** Spring Data JPA / Hibernate
- **Password Hashing:** BCrypt
- **Authentication:** JWT with HttpOnly Secure Cookies

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **HTTP Client:** Axios (with credentials support)
- **State Management:** React Context API + useReducer
- **Routing:** React Router DOM v6
- **Styling:** CSS3

### Databases
- **Primary DB:** MySQL 8.0 (local)
- **Cache Layer:** Redis Cloud (remote/cloud)

---

## Project Structure

```
24MARKETS/
├── 24markets-backend/                    # Spring Boot Application
│   ├── src/main/java/com/markets/
│   │   ├── MarketsApplication.java       # Main Spring Boot App
│   │   ├── config/                       # Configuration
│   │   │   ├── RedisConfig.java          # Redis cache configuration
│   │   │   ├── RedisTestBase.java        # Redis test base
│   │   │   └── SecurityConfig.java       # Spring Security + CORS config
│   │   ├── controller/                   # REST Controllers
│   │   │   ├── AuthController.java       # Auth endpoints (Register/Login/Me)
│   │   │   ├── UserController.java       # User CRUD endpoints
│   │   │   ├── MarketController.java     # Market CRUD endpoints
│   │   │   └── OrderController.java      # Order CRUD endpoints
│   │   ├── dto/                          # Data Transfer Objects
│   │   │   ├── AuthRequest.java
│   │   │   ├── AuthResponse.java
│   │   │   ├── ErrorResponse.java
│   │   │   └── OrderDTO.java
│   │   ├── entity/                       # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Market.java
│   │   │   └── Order.java
│   │   ├── exception/                    # Custom Exceptions
│   │   ├── filter/                       # Security Filters
│   │   │   └── JwtAuthenticationFilter.java
│   │   ├── repository/                   # Database Access (JPA Repos)
│   │   │   ├── UserRepository.java
│   │   │   ├── MarketRepository.java
│   │   │   └── OrderRepository.java
│   │   ├── service/                      # Business Logic
│   │   │   ├── UserService.java
│   │   │   ├── MarketService.java
│   │   │   └── OrderService.java
│   │   ├── Test/                         # Test utilities
│   │   └── util/                         # Utilities
│   │       └── JwtUtil.java              # JWT token generation & validation
│   ├── src/main/resources/
│   │   └── application.properties        # App + DB + Redis + JWT config
│   ├── src/test/                         # Unit tests
│   └── pom.xml                           # Maven dependencies
│
├── 24markets-frontend/                   # React + Vite Application
│   ├── src/
│   │   ├── components/                   # Reusable Components
│   │   │   ├── Navbar.jsx
│   │   │   ├── MarketList.jsx
│   │   │   └── OrderForm.jsx
│   │   ├── pages/                        # Page Components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Markets.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Users.jsx                 # Admin: manage users
│   │   │   └── UsersOrders.jsx           # Admin: view all users' orders
│   │   ├── context/                      # State Management
│   │   │   └── AppContext.jsx            # Global app state
│   │   ├── hooks/                        # Custom Hooks
│   │   │   └── useAppContext.js
│   │   ├── services/                     # API Services
│   │   │   └── api.js                    # Axios instance & all API calls
│   │   ├── styles/                       # CSS Styles
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Home.css
│   │   │   ├── MarketList.css
│   │   │   ├── Markets.css
│   │   │   ├── Navbar.css
│   │   │   └── OrderForm.css
│   │   ├── App.jsx                       # Main App with routes
│   │   ├── App.css
│   │   ├── main.jsx                      # React entry point
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
│
├── mysql.sql                             # Database setup script
└── README.md                             # This file
```

---

## Authentication

### JWT Implementation
- **Algorithm:** HS512 (HMAC SHA-512)
- **Expiration:** 10 hours (36000000 ms)
- **Secret Key:** Configured in `application.properties`
- **Storage:** JWT token is stored in `localStorage` on the frontend
- **Axios Interceptor:** Token is automatically attached to every request via Axios headers
- **Password:** BCrypt hashing

### Roles
- `ROLE_USER` - Standard user (can browse markets, place orders, view own orders)
- `ROLE_ADMIN` - Admin user (can manage all users, markets, and view all orders)

### Authentication Flow
```
1. User Registers or Logs In via /api/auth/register or /api/auth/login
2. Backend validates credentials & hashes password (BCrypt)
3. JWT token generated with userId, email, role claims
4. Token returned in JSON response
5. Frontend stores token in localStorage
6. Axios interceptor attaches token as Authorization: Bearer <token> header
7. Backend JwtAuthenticationFilter validates token on every protected request
8. User can logout (token removed from localStorage)
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  wallet_balance DOUBLE DEFAULT 0.0,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  is_admin BOOLEAN DEFAULT FALSE,
  role VARCHAR(50) DEFAULT 'ROLE_USER',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Markets Table
```sql
CREATE TABLE markets (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(50) NOT NULL,
  current_price DOUBLE NOT NULL,
  open_price DOUBLE NOT NULL,
  high_price DOUBLE NOT NULL,
  low_price DOUBLE NOT NULL,
  volume BIGINT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  market_id BIGINT NOT NULL,
  order_type VARCHAR(50) NOT NULL,       -- BUY or SELL
  quantity DOUBLE NOT NULL,
  price_per_unit DOUBLE NOT NULL,
  total_amount DOUBLE NOT NULL,
  status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, COMPLETED, CANCELLED, REJECTED
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (market_id) REFERENCES markets(id)
);
```

---

## Configure Database

Edit `24markets-backend/src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/markets_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Redis Configuration (Cloud)
spring.data.redis.host=YOUR_REDIS_HOST
spring.data.redis.port=YOUR_REDIS_PORT
spring.data.redis.password=YOUR_REDIS_PASSWORD
spring.data.redis.ssl.enabled=false
spring.data.redis.timeout=3600000
spring.cache.type=redis
spring.cache.redis.time-to-live=60000

# JWT Configuration
jwt.secret=your-super-secret-key-change-this-in-production
jwt.expiration=36000000

# Logging
logging.level.root=INFO
logging.level.com.markets=DEBUG
```

---

## Installation & Setup

### Prerequisites
- Java JDK 11 or higher
- Maven 3.6+
- Node.js 14+ & npm
- MySQL 8.0
- Redis (Cloud account from redis.com or local)

### Backend Setup

**1. Create MySQL Database**
```bash
mysql -u root -p
CREATE DATABASE markets_db;
EXIT;
```

**2. Configure Redis Cloud**
- Sign up at https://redis.com/cloud/
- Create a free database
- Copy connection details (host, port, password)

**3. Update application.properties**
```bash
cd 24markets-backend
# Edit src/main/resources/application.properties
# Set your MySQL credentials and Redis Cloud credentials
```

**4. Build & Run Backend**
```bash
cd 24markets-backend
mvn clean install
mvn spring-boot:run
```
Backend runs at: `http://localhost:8080`

### Frontend Setup

**1. Install Dependencies**
```bash
cd 24markets-frontend
npm install
```

**2. Run Frontend**
```bash
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## API Endpoints

### Auth Endpoints

| Method | Endpoint | Protected | Admin | Description |
|--------|----------|-----------|-------|-------------|
| POST | `/api/auth/register` | No | No | Register new user |
| POST | `/api/auth/login` | No | No | Login user |
| GET | `/api/auth/me` | Yes | No | Get current authenticated user |

#### Register Request & Response

```json
// POST /api/auth/register
// Request:
{
  "firstName": "Gayatri",
  "lastName": "Kumari",
  "email": "test@mail.com",
  "password": "MyPass@123",
  "isAdmin": false
}

// Response:
{
  "message": "Registration successful",
  "email": "test@mail.com",
  "token": "JWT_TOKEN",
  "userId": 11,
  "fullName": "Gayatri Kumari",
  "walletBalance": 1000,
  "expiresIn": 35999011,
  "isAdmin": false
}
```

#### Login Request & Response

```json
// POST /api/auth/login
// Request:
{
  "email": "test@mail.com",
  "password": "MyPass@123"
}

// Response:
{
  "message": "Login successful",
  "email": "test@mail.com",
  "token": "JWT_TOKEN",
  "userId": 7,
  "fullName": "Gayatri Kumari",
  "walletBalance": 100000,
  "expiresIn": 35999482,
  "isAdmin": true
}
```

---

### User Endpoints

| Method | Endpoint | Protected | Admin | Description |
|--------|----------|-----------|-------|-------------|
| GET | `/api/users/{id}` | Yes | No | Get user by ID |
| GET | `/api/users/all` | Yes | Yes | Get all users (admin only) |
| PUT | `/api/users/{id}` | Yes | No | Update user profile |
| DELETE | `/api/users/{id}` | Yes | Yes | Delete user (admin only) |

---

### Market Endpoints

| Method | Endpoint | Protected | Admin | Description |
|--------|----------|-----------|-------|-------------|
| GET | `/api/markets/getAllMarkets` | No | No | Get all markets (Redis cached) |
| POST | `/api/markets` | Yes | Yes | Create new market (admin only) |
| PUT | `/api/markets/{id}` | Yes | Yes | Update market (admin only) |

---

### Order Endpoints

| Method | Endpoint | Protected | Admin | Description |
|--------|----------|-----------|-------|-------------|
| POST | `/api/orders/createOrder` | Yes | No | Create new order |
| GET | `/api/orders/{id}` | Yes | No | Get order by ID |
| GET | `/api/orders/user/{userId}` | Yes | No | Get orders for a user |
| GET | `/api/orders/all` | Yes | Yes | Get all users' orders (admin only, includes user & market data) |
| GET | `/api/orders/getRecentsOrders` | Yes | No | Get recent orders |
| PUT | `/api/orders/status/{id}` | Yes | Yes | Update order status |
| DELETE | `/api/orders/{id}` | Yes | Yes | Delete order (admin only) |

**Note:** `GET /api/orders/all` uses `JOIN FETCH o.user JOIN FETCH o.market` to return each order with full user and market details in a single query.

---

## Redis Usage

Redis is used for caching market data to improve performance and reduce database load.

### Benefits
- Faster market list loading (sub-millisecond reads from cache)
- Reduced MySQL database load
- Better performance under high traffic
- Configurable TTL (Time To Live) for cache entries

### Cache Flow
```
1. User requests market list (GET /api/markets/getAllMarkets)
2. Check Redis cache for market data
3. If cache HIT  -> return cached data immediately
4. If cache MISS -> fetch from MySQL database
5. Store fetched data in Redis cache
6. Return data to user
```

### Cache Invalidation
When a market is created or updated (POST/PUT `/api/markets`), the Redis cache is automatically invalidated. The next GET request will fetch fresh data from the database and repopulate the cache.

### Configuration
```properties
spring.cache.type=redis
spring.cache.redis.time-to-live=60000     # Cache TTL: 60 seconds
spring.data.redis.timeout=3600000          # Connection timeout: 1 hour
```

---

## Security & Roles

### Role-Based Access

| Role | Permissions |
|------|------------|
| `ROLE_USER` | View markets, place orders, view own orders, manage own profile |
| `ROLE_ADMIN` | All user permissions + manage all users, create/update markets, view all orders, update order status, delete users/orders |

### Frontend Role Checks
The frontend `api.js` service includes helper functions:
- `isAdmin()` - checks if current user has admin privileges
- Admin-only API calls throw `"Admin only"` error if non-admin user attempts access

### Backend Security
- Spring Security filters protect endpoints based on JWT token
- `JwtAuthenticationFilter` validates token on every request
- `SecurityConfig.java` defines which endpoints are public vs protected

---

## Common Issues

### 403 Forbidden
- Check Spring Security role configuration in `SecurityConfig.java`
- Ensure the JWT token is valid and not expired
- Verify the user has the correct role for the endpoint

### Admin Only Error
- If frontend throws "Admin only" error, check that the user's `isAdmin` flag is `true`
- Remove or adjust frontend role checks in `api.js` if needed during development

### Redis Connection Error
- Make sure your Redis server is running (cloud or local)
- Verify Redis host, port, and password in `application.properties`
- Test connection: `redis-cli -u redis://default:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT`
- Check if SSL is required for your Redis provider

### MySQL Connection Error
```bash
# Start MySQL service
sudo systemctl start mysql    # Linux
brew services start mysql     # macOS

# Verify database exists
mysql -u root -p
SHOW DATABASES;
# Should see markets_db
```

### CORS Error in Frontend
- Ensure backend is running at `localhost:8080`
- Check CORS configuration in `SecurityConfig.java`
- Frontend must be at `localhost:5173` (or whatever is configured)

### JWT Token Expired
- Default expiration is 10 hours (36000000 ms)
- User must log in again after token expires
- Adjust `jwt.expiration` in `application.properties` if needed

---

## Features Implemented

- User Registration & Login with JWT Authentication
- Password hashing with BCrypt
- Role-based access control (User / Admin)
- User wallet management
- Market data CRUD operations (Admin)
- Redis caching for market data with automatic invalidation
- Order management (Create, Read, Update Status, Delete)
- Admin: View all users' orders with full user & market details (JOIN FETCH)
- Admin: Manage all users (view, delete)
- Spring Security integration with JWT filter
- CORS configuration for frontend-backend communication
- React Context API for global state management
- Responsive UI with CSS styling
- Axios interceptors for automatic token attachment
- Error handling on both frontend and backend

---

## Dependencies

### Backend (pom.xml)
- Spring Boot Starter Web 3.1.5
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter Data Redis
- MySQL Connector 8.0.33
- JJWT API / Impl / Jackson 0.12.3
- Lombok 1.18.30
- JUnit 4.13.2

### Frontend (package.json)
- React 18.2.0
- React DOM 18.2.0
- React Router DOM 6.11.0
- Axios 1.4.0
- Vite 4.3.9

---

## Running in Development

**Terminal 1 - Backend**
```bash
cd 24markets-backend
mvn spring-boot:run
```

**Terminal 2 - Frontend**
```bash
cd 24markets-frontend
npm run dev
```

**Terminal 3 - Redis (if local)**
```bash
redis-server
```

---

## Build for Production

**Backend**
```bash
cd 24markets-backend
mvn clean package -DskipTests
java -jar target/24markets-backend-1.0.0.jar
```

**Frontend**
```bash
cd 24markets-frontend
npm run build
# Output in dist/ folder - serve with any static server
```

---

## Project Statistics

- **Total API Endpoints:** 14
- **Database Tables:** 3 (Users, Markets, Orders)
- **React Pages:** 8 (Home, Login, Register, Dashboard, Markets, Orders, Users, UsersOrders)
- **React Components:** 3 (Navbar, MarketList, OrderForm)
- **Backend Services:** 3 (UserService, MarketService, OrderService)
- **Authentication:** JWT-based with localStorage + Axios interceptor
- **Caching:** Redis Cloud with configurable TTL

---

**Last Updated:** February 2026
**Version:** 1.0.0
