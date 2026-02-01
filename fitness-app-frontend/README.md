## 🔐 React Frontend – OAuth2 PKCE with Keycloak

This React application serves as the frontend for the **Fitness Microservices Platform** and integrates with **Keycloak** using **OAuth 2.0 Authorization Code Flow with PKCE**.

---

## ✨ Features

* Secure authentication via Keycloak
* Activity tracking UI
* AI-generated fitness recommendations
* Backend access via API Gateway only

---

## 🧱 Tech Stack

* React 18
* Vite
* Redux Toolkit
* react-oauth2-code-pkce
* Material UI

---

## 🔐 Authentication Flow

```
Browser
 → React App
 → PKCE Auth Provider
 → Keycloak (OIDC)
 → JWT Token
 → Redux Store + localStorage
```

* PKCE handles token exchange securely
* Redux stores authenticated user state
* Tokens persist across refresh via localStorage

---

## 📁 Key Files

| File          | Purpose              |
| ------------- | -------------------- |
| authConfig.js | Keycloak PKCE config |
| main.jsx      | App bootstrap        |
| App.jsx       | Login flow           |
| authSlice.js  | Auth state           |
| store.js      | Redux store          |

---

## ▶️ Run Frontend

```bash
npm install
npm run dev
```

Access:

```
http://localhost:5173
```

---

## 🔗 Backend Integration

* Communicates **only** via API Gateway
* JWT automatically attached to requests
* Backend services must be running