# 🏋️‍♂️ Fitness Microservices Platform

A **Spring Boot–based microservices architecture** for tracking user fitness activities and generating AI-powered recommendations.

This project demonstrates:

* Service discovery with **Eureka**
* Asynchronous communication using **RabbitMQ**
* Polyglot persistence (**PostgreSQL + MongoDB**)
* Inter-service communication using **WebClient**
* Clean separation of concerns using microservices

> ⚠️ **Note:** Spring Cloud Config Server is **not yet introduced** at this stage.

---

## 🧩 Architecture Overview

```
┌──────────────┐
│   Eureka     │
│  Server      │
│   :8761      │
└──────┬───────┘
       │ Service Discovery
 ┌─────┴─────┐
 │           │
 │           │
┌▼────────┐ ┌▼─────────┐
│ User     │ │ Activity │
│ Service  │ │ Service  │
│ :8081    │ │ :8082    │
└──────────┘ └────┬─────┘
                   │ RabbitMQ Event
                   ▼
             ┌───────────┐
             │ AI Service │
             │ :8083     │
             └───────────┘
```

---

## 🛠 Tech Stack

### Backend

* **Java 21**
* **Spring Boot**
* **Spring Web / WebFlux**
* **Spring Data JPA**
* **Spring Data MongoDB**
* **Spring Cloud Netflix Eureka**
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
* All services register themselves here

```yaml
spring:
  application:
    name: eureka
```

---

### 2️⃣ User Service

**Port:** `8081`
**Database:** PostgreSQL

#### Responsibilities

* User registration
* Fetch user profile
* Validate user existence (used by other services)

#### Key APIs

| Method | Endpoint                       | Description             |
| ------ | ------------------------------ | ----------------------- |
| POST   | `/api/users/register`          | Register new user       |
| GET    | `/api/users/{userId}`          | Get user profile        |
| GET    | `/api/users/{userId}/validate` | Validate user existence |

---

### 3️⃣ Activity Service

**Port:** `8082`
**Database:** MongoDB
**Messaging:** Publishes events to RabbitMQ

#### Responsibilities

* Track user activities
* Store activity metrics
* Publish activity events for AI processing
* Communicate with User Service via Eureka + WebClient

#### Activity Types Supported

```
WALKING, RUNNING, CYCLING, SWIMMING,
WEIGHT_TRAINING, YOGA, HIIT,
CARDIO, STRETCHING, OTHER
```

#### Key APIs

| Method | Endpoint               | Description         |
| ------ | ---------------------- | ------------------- |
| POST   | `/api/activities`      | Track activity      |
| GET    | `/api/activities`      | Get user activities |
| GET    | `/api/activities/{id}` | Get activity by ID  |

> Requires header: `X-User-ID`

---

### 4️⃣ AI Service

**Port:** `8083`
**Database:** MongoDB
**Messaging:** Consumes RabbitMQ events

#### Responsibilities

* Consume activity events
* Generate AI-powered recommendations
* Store recommendations
* Expose recommendation APIs

#### Key APIs

| Method | Endpoint                                     | Description             |
| ------ | -------------------------------------------- | ----------------------- |
| GET    | `/api/recommendations/user/{userId}`         | User recommendations    |
| GET    | `/api/recommendations/activity/{activityId}` | Activity recommendation |

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
docker run -it --rm --name rabbitmq \
-p 5672:5672 -p 15672:15672 \
rabbitmq:4-management
```

RabbitMQ UI:
👉 [http://localhost:15672](http://localhost:15672)
**Username:** guest
**Password:** guest

> Docker Desktop must be installed.
> If not, install RabbitMQ directly on host.

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

## 🔑 Environment Variables (AI Service)

Set the following in your IDE or system:

```bash
GEMINI_API_URL=your_gemini_api_url
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🚀 How to Run (Order Matters)

1️⃣ Start **RabbitMQ**
2️⃣ Start **MongoDB**
3️⃣ Start **PostgreSQL**
4️⃣ Start **Eureka Server**
5️⃣ Start **User Service**
6️⃣ Start **Activity Service**
7️⃣ Start **AI Service**

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

## 📌 Current Status

✅ Service Discovery
✅ User Management
✅ Activity Tracking
✅ Event-driven AI Integration
✅ RabbitMQ Messaging
⏳ Spring Cloud Config Server (Upcoming)

---

## 👨‍💻 Author

Built as part of a **microservices learning journey** using Spring Boot, Cloud, Messaging, and AI integration.
