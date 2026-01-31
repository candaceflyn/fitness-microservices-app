# 🔐 React Frontend – Keycloak PKCE Authentication

This React frontend integrates **Keycloak** using **OAuth 2.0 Authorization Code Flow with PKCE**.
The purpose of this setup is to validate Keycloak connectivity, perform login, and display token data before integrating backend APIs.

---

## 🧱 Tech Stack 

* **React 18**
* **Vite**
* **Redux Toolkit**
* **react-oauth2-code-pkce**
* **Material UI**

---

## 🧠 Authentication Architecture

```
Browser
  ↓
React App (Vite)
  ↓
AuthProvider (PKCE)
  ↓
Keycloak (OIDC)
  ↓
JWT Token + Token Data
  ↓
Redux Store + localStorage
```

* **AuthProvider** handles PKCE, redirects, and token exchange
* **Redux** stores authenticated user data for app-wide access
* **localStorage** persists auth state across refresh

---

## 📁 Relevant Files

| File                 | Responsibility              |
| -------------------- | --------------------------- |
| `authConfig.js`      | Keycloak PKCE configuration |
| `main.jsx`           | App bootstrap + providers   |
| `App.jsx`            | Login UI + auth flow        |
| `store/authSlice.js` | Auth state management       |
| `store/store.js`     | Redux store configuration   |

---

## ⚙️ Keycloak Setup (Required)

### 1️⃣ Run Keycloak

```bash
docker run -p 127.0.0.1:8181:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin quay.io/keycloak/keycloak:26.5.2 start-dev
```

Access Admin Console:

```
http://localhost:8181
```

---

### 2️⃣ Create Realm

```
Realm Name: fitness-oauth2
```

Ensure **Realm Enabled = ON**

---

### 3️⃣ Create Client (PKCE Public Client)

| Setting               | Value              |
| --------------------- | ------------------ |
| Client ID             | oauth2-pkce-client |
| Client Type           | OpenID Connect     |
| Client Authentication | OFF                |
| Standard Flow         | ENABLED            |
| Direct Access Grants  | ENABLED            |

---

### 4️⃣ Redirect & Origin Configuration

Valid Redirect URI: ```http://localhost:5173```

Web Origins: ```http://localhost:5173```

---

### 5️⃣ Enable PKCE

```
Client → Capability Config → PKCE Method: S256
```

---

### 6️⃣ Create User

1. Go to **Users → Create User**
2. Set username
3. Go to **Credentials**
4. Set password
5. Disable **Temporary**
6. Save

This user will be used to log in from the React app.

---

## 🧪 Running the Frontend

```bash
npm install
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 🔑 Login Flow (What to Expect)

1. App loads → **Login button appears**
2. Click **Login**
3. Redirect to Keycloak login page
4. Login with created Keycloak user
5. Redirect back to React app
6. JWT token and decoded token data are displayed on screen

This confirms:

* PKCE flow is working
* React ↔ Keycloak connectivity is successful

---

## 🗄 Redux Authentication State

On successful login:

```js
auth: {
  user,     // decoded JWT (tokenData)
  token,    // access token (JWT string)
  userId    // Keycloak subject (sub)
}
```

Data is also stored in **localStorage** to persist authentication across page refreshes.

---

## 🚫 Backend Dependency

> ❗ **Backend services are NOT required at this stage**

This frontend setup:

* Does **not** call any backend API
* Is only validating Keycloak authentication
* Backend integration will be added in later phases

