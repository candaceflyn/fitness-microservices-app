# 🏋️‍♂️ Fitness Microservices Platform

A **Spring Boot–based microservices architecture** for tracking user fitness activities and generating AI-powered recommendations.

This project demonstrates:

* Service discovery with **Eureka**
* Edge routing using **Spring Cloud API Gateway**
* Centralized configuration via **Spring Cloud Config (client enabled)**
* Asynchronous communication using **RabbitMQ**
* Polyglot persistence (**PostgreSQL + MongoDB**)
* AI integration using **Google Gemini API**

---
## 🔐 One-Time Authentication Setup (Required)

⚠️ **This step is mandatory before running the application for the first time.**

The platform uses **Keycloak (OAuth2 + PKCE)** for authentication.
You must configure a **realm, client, and user** in Keycloak before the app can be accessed.

👉 If you have already configured Keycloak for this project, you can skip this section.

### Required Steps (Once)

1. Ensure Keycloak is running
2. Create Realm: `fitness-oauth2`
3. Create Client: `oauth2-pkce-client` (PKCE enabled)
4. Create a User and set credentials
5. Verify issuer URI and client configuration

📌 **Detailed step-by-step instructions are provided in the  
[Authentication & Authorization (Keycloak)](#-authentication--authorization-keycloak) section below.**

---

## ⚡ Quick Start (TL;DR)

### 🔧 Prerequisites

- **Docker & Docker Compose**
- **Java 21**
- **Maven**
- **Node.js 18+**

---

## ▶️ Start & Stop the Application (Recommended)

This project provides helper scripts to start and stop the entire platform
(infrastructure, backend services, and frontend) from a single command.

### 🚀 Start Everything

From the project root:

```bat
start-all.bat
````

This script will:

* Start **Keycloak** and **RabbitMQ** using Docker
* Start all Spring Boot microservices:

   * Eureka Server
   * Config Server
   * User Service
   * Activity Service
   * AI Service
   * API Gateway
* Start the **React frontend** (`npm run dev`)
* Wait for each service to become available before starting the next one

⚠️ **Important:**
Before running `start-all.bat`, you must configure your **Gemini API credentials**
inside the script (see below).

#### 🔑 Gemini API Configuration (Required for AI Service)

The AI Service depends on the **Google Gemini API**.
Environment variables must be set **before the AI service starts**.

These variables are configured directly inside `start-all.bat`:

```bat
set GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=
set GEMINI_API_KEY=YOUR_REAL_API_KEY_HERE
````

🔴 If these variables are missing or incorrect, the **AI Service will fail to start**
with a `PlaceholderResolutionException`.

👉 Generate your API key from:
[https://aistudio.google.com/api-keys](https://aistudio.google.com/api-keys)

Open:

* Frontend → [http://localhost:5173](http://localhost:5173)
* API Gateway → [http://localhost:8080](http://localhost:8080)

---

### 🛑 Stop Everything

To stop all running services and containers:

```bat
stop-all.bat
```

This will:

* Stop all Spring Boot services
* Stop the React frontend
* Shut down Docker containers (Keycloak, RabbitMQ)

---

## 🧩 Architecture Overview

```
                 ┌────────────────┐
                 │  API GATEWAY   │
                 │     :8080      │
                 └───────┬────────┘
                         │
                 ┌───────▼────────┐
                 │    Eureka      │
                 │   Server :8761 │
                 └───────┬────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼───────┐ ┌──────▼────────┐ ┌─────▼──────┐
│ User Service  │ │ Activity Serv │ │ AI Service │
│     :8081     │ │     :8082     │ │   :8083    │
└───────────────┘ └──────┬────────┘ └────────────┘
                           │
                     RabbitMQ Event
                           ▼
                   AI Recommendation
```

---

## 🛠 Tech Stack

### Backend

* **Java 21**
* **Spring Boot 4**
* **Spring Web / WebFlux**
* **Spring Cloud Netflix Eureka**
* **Spring Cloud Gateway**
* **Spring Cloud Config (Client)**
* **Spring Data JPA**
* **Spring Data MongoDB**
* **RabbitMQ**
* **Spring Security (OAuth 2.0 Resource Server)**
* **Keycloak (OIDC Provider, JWT-based auth)**

### Databases

* **PostgreSQL** → User Service
* **MongoDB** → Activity Service, AI Service

### Messaging

* **RabbitMQ (Direct Exchange)**

### AI Integration

* **Google Gemini API** (via environment variables)

---

## 🔐 Authentication & Authorization (Keycloak)

This platform uses **Keycloak** as the **OAuth 2.0 / OpenID Connect (OIDC) provider**.
All external API access is secured using **JWT-based authentication**, enforced at the **API Gateway**.

---

### 🧱 Keycloak Setup

```bash
docker run -p 127.0.0.1:8181:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.5.2 start-dev
```

Access Keycloak Admin Console:

```
http://localhost:8181
```

**Admin Credentials:**

```
Username: admin
Password: admin
```

---

### 🌍 Realm Configuration

1. Create a new realm:

   ```
   Realm Name: fitness-oauth2
   ```
2. Ensure **Realm Enabled** is ON

---

### 🧩 Client Configuration (PKCE-based Client)

Create a new client under the `fitness-oauth2` realm:

| Setting               | Value               |
| --------------------- | ------------------- |
| Client Type           | OpenID Connect      |
| Client ID             | oauth2-pkce-client  |
| Client Authentication | OFF (Public Client) |

#### Authentication Flow

Enable:

* ✅ Standard Flow
* ✅ Direct Access Grants

#### Redirect & Origin Configuration

```text
Valid Redirect URI:
http://localhost:5173

Web Origins:
http://localhost:5173
```

Save the client.

---

### 🔐 PKCE Configuration

Go to:

```
Client → Settings → Capability Config
```

Set:

```
Proof Key for Code Exchange (PKCE): S256
```

Save changes.

---

### 🔎 OpenID Configuration & Issuer

From:

```
Realm Settings → General → Endpoints → OpenID Endpoint Configuration
```

This opens:

```
http://localhost:8181/realms/fitness-oauth2/.well-known/openid-configuration
```

Extract the **issuer URI**:

```
http://localhost:8181/realms/fitness-oauth2
```

---

### ⚙️ API Gateway Security Configuration

The API Gateway acts as an **OAuth 2.0 Resource Server** and validates JWTs issued by Keycloak.

`bootstrap.yml` (Gateway):

```yaml
spring:
  application:
    name: api-gateway

  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8181/realms/fitness-oauth2
```

> Security configuration is loaded at **bootstrap time** to ensure JWT validation is available before application startup.

---

### 👤 User Setup in Keycloak

1. Go to **Users → Create User**
2. Set username and save
3. Go to **Credentials**
4. Set password
5. Disable **Temporary**
6. Save

---

### 🧪 Testing Authentication via Postman (PKCE Flow)

1. Open Postman
2. Go to **Collection → Authorization**
3. Select **OAuth 2.0**
4. Configure token:

| Field                 | Value                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Token Name            | fitness-app-token                                                                                                                                      |
| Grant Type            | Authorization Code (with PKCE)                                                                                                                         |
| Callback URL          | [http://localhost:5173](http://localhost:5173)                                                                                                         |
| Auth URL              | [http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/auth](http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/auth)   |
| Access Token URL      | [http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/token](http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/token) |
| Client ID             | oauth2-pkce-client                                                                                                                                     |
| Code Challenge Method | SHA-256                                                                                                                                                |

5. Click **Get New Access Token**
6. Login with the Keycloak user credentials
7. Click **Use Token**

All subsequent API calls will include the `Authorization: Bearer <token>` header.

🔁 When the token expires, click **Refresh Token** in Postman to obtain a new access token without re-authentication.

---

### 🔒 Security Behavior

* ✅ All API endpoints are **secured by default**
* ❌ Requests without a valid JWT return **401 Unauthorized**
* ✅ Token validation is enforced at the **API Gateway**
* ✅ Downstream services are accessed only via the Gateway

---

## 📦 Microservices Breakdown

### 1️⃣ Eureka Server

**Port:** `8761`

* Central service registry
* All services register here

---

### 2️⃣ API Gateway (Edge Service)

**Port:** `8080`

* Single entry point for all APIs
* Load-balanced routing via Eureka
* No direct service port exposure
* OAuth 2.0 Resource Server using Keycloak (JWT validation)

#### Configured Routes

| Service          | Path                      |
| ---------------- | ------------------------- |
| User Service     | `/api/users/**`           |
| Activity Service | `/api/activities/**`      |
| AI Service       | `/api/recommendations/**` |

#### Verification

```http
GET http://localhost:8080/actuator/gateway/routes
```

You **must** see:

* `user-service`
* `activity-service`
* `ai-service`

---

### 3️⃣ User Service

**Port:** `8081`
**Database:** PostgreSQL

#### APIs

| Method | Endpoint                       |
| ------ | ------------------------------ |
| POST   | `/api/users/register`          |
| GET    | `/api/users/{userId}`          |
| GET    | `/api/users/{userId}/validate` |

---

### 4️⃣ Activity Service

**Port:** `8082`
**Database:** MongoDB
**Messaging:** RabbitMQ producer

* Tracks activities
* Publishes activity events
* Communicates with User Service via Eureka

---

### 5️⃣ AI Service

**Port:** `8083`
**Database:** MongoDB
**Messaging:** RabbitMQ consumer

* Consumes activity events
* Generates AI recommendations
* Stores and exposes results

---

## 🗄 Database Setup

### MongoDB

* Used by Activity Service & AI Service
* MongoDB Compass installed
* Default URI:

```
mongodb://localhost:27017
```

Databases:

* `fitnessactivity`
* `fitnessrecommendation`

---

### PostgreSQL

* Used by User Service

```sql
CREATE DATABASE fitness_user_db;
```

Default credentials:

```
username: postgres
password: postgres
```

---

## 🐰 RabbitMQ Configuration

### Exchange

```
fitness.exchange
```

### Queue

```
activity.queue
```

### Routing Key

```
activity.tracking
```

### Docker Command (Recommended)

```bash
docker run -it --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4-management
```

RabbitMQ UI:
👉 [http://localhost:15672](http://localhost:15672)
**Username:** guest
**Password:** guest

> Docker Desktop must be installed.
> If not, install RabbitMQ directly on host.

---

## 🔑 Gemini API Setup (IMPORTANT)

### 1️⃣ Generate API Key

👉 [https://aistudio.google.com/api-keys](https://aistudio.google.com/api-keys)

### 2️⃣ Test via CURL / Postman

```bash
curl "YOUR_GEMINI_URL" \
  -H "Content-Type: application/json" \
  -H "X-goog-api-key: YOUR_GEMINI_KEY" \
  -X POST \
  -d '{
    "contents": [
      {
        "parts": [
          { "text": "Explain how AI works in a few words" }
        ]
      }
    ]
  }'
```

### 3️⃣ Configure in IntelliJ (AI Service)

```
Edit Configurations →
AI Service →
Modify Options →
Environment Variables
```

```env
GEMINI_API_URL=https://generativelanguage.googleapis.com/...?key=
GEMINI_API_KEY=YOUR_GEMINI_KEY
```

---

## 🚀 Startup Order (STRICT)

1️⃣ Keycloak  
2️⃣ RabbitMQ  
3️⃣ Eureka Server  
4️⃣ Config Server  
5️⃣ User Service  
6️⃣ Activity Service  
7️⃣ AI Service  
8️⃣ API Gateway  

---

## 📮 Postman Collection

A Postman collection will be added under:

```
/postman-collection
```

Each API includes:

* Sample request
* Required headers
* Example payloads

### Example: Register User

```json
POST /api/users/register
{
  "email": "test@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Example: Track Activity

```json
POST /api/activities
Headers:
X-User-ID: <USER_ID>

{
  "userId": "<USER_ID>",
  "activityType": "RUNNING",
  "duration": 30,
  "caloriesBurned": 250,
  "startTime": "2026-01-25T10:00:00",
  "additionalMetrics": {
    "distance": "5km",
    "avgSpeed": "10km/h"
  }
}
```

---

## 🌐 Access APIs (via Gateway ONLY)

```http
http://localhost:8080/api/users/...
http://localhost:8080/api/activities/...
http://localhost:8080/api/recommendations/...
```

---

## 👨‍💻 Author

Built as part of a **hands-on microservices learning journey**, focusing on **real-world architecture**, messaging, and AI integration.
