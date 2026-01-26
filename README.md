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

## 🧩 Architecture Overview

```
                 ┌────────────────┐
                 │  API GATEWAY   │
                 │     :8080      │
                 └───────┬────────┘
                         │
                 ┌───────▼────────┐
                 │    Eureka       │
                 │   Server :8761  │
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
* **Lombok**

### Databases

* **PostgreSQL** → User Service
* **MongoDB** → Activity Service, AI Service

### Messaging

* **RabbitMQ (Direct Exchange)**

### AI Integration

* **Google Gemini API** (via environment variables)

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

1️⃣ RabbitMQ
2️⃣ Eureka Server
3️⃣ Config Server
4️⃣ User Service
5️⃣ Activity Service
6️⃣ AI Service
7️⃣ API Gateway

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
