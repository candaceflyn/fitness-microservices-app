# 🔐 React Frontend – Keycloak PKCE Authentication

This React frontend integrates **Keycloak** using **OAuth 2.0 Authorization Code Flow with PKCE**
and serves as the user interface for the Fitness Microservices Platform.

The application supports:
- Secure login via Keycloak
- Activity tracking
- AI-powered fitness recommendations
- API access via the Spring Cloud API Gateway

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

## ⚠️ Keycloak Prerequisite

Keycloak must be running and configured as described in the **root project README**.

Required:
- Realm: `fitness-oauth2`
- Client: `oauth2-pkce-client` (PKCE enabled)
- At least one user

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

## 🔗 Backend Integration

This frontend is now fully integrated with the backend microservices.

The React app communicates ONLY via :

[API Gateway](http://localhost:8080)

### APIs used:
- `/api/activities`
- `/api/recommendations`
- `/api/users`

Authentication:
- Handled via **Keycloak PKCE**
- JWT token automatically attached by Axios interceptor

Backend services **must be running** for full functionality.
