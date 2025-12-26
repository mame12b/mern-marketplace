# Authentication Flow Diagram

## Registration Flow
```
┌─────────────┐
│   Browser   │
│  (Register  │
│    Form)    │
└──────┬──────┘
       │ 1. User fills form & submits
       │    {firstName, lastName, email, password, role}
       ▼
┌─────────────────────┐
│  RegisterForm.jsx   │
│  - Validates input  │
│  - Dispatches       │
│    register()       │
└──────┬──────────────┘
       │ 2. Redux action
       ▼
┌─────────────────────┐
│   authSlice.js      │
│  - register thunk   │
└──────┬──────────────┘
       │ 3. API call
       ▼
┌─────────────────────┐
│  authService.js     │
│  - registerUser()   │
│  - POST /register   │
└──────┬──────────────┘
       │ 4. HTTP Request with Bearer token
       ▼
┌─────────────────────┐
│   axios.js          │
│  - Interceptor      │
│  - Add headers      │
└──────┬──────────────┘
       │ 5. HTTP POST
       ▼
┌─────────────────────────────┐
│  Backend: Express Server    │
│  /api/auth/register route   │
└──────┬──────────────────────┘
       │ 6. Route handler
       ▼
┌──────────────────────────────┐
│  authController.js           │
│  - registerUser()            │
│  - Validate input            │
│  - Check existing user       │
│  - Hash password (bcrypt)    │
│  - Save to MongoDB           │
│  - Generate JWT              │
│  - Generate refresh token    │
└──────┬───────────────────────┘
       │ 7. Response
       │    {success, message, token, user}
       ▼
┌─────────────────────┐
│  authService.js     │
│  - Receive response │
│  - Save to          │
│    localStorage     │
└──────┬──────────────┘
       │ 8. Return data
       ▼
┌─────────────────────┐
│   authSlice.js      │
│  - Update state     │
│  - user: {...}      │
│  - token: "..."     │
└──────┬──────────────┘
       │ 9. State updated
       ▼
┌─────────────────────┐
│  RegisterForm.jsx   │
│  - Redirect to home │
│  - Show success msg │
└─────────────────────┘
```

## Login Flow
```
┌─────────────┐
│   Browser   │
│   (Login    │
│    Form)    │
└──────┬──────┘
       │ 1. User enters credentials
       │    {email, password}
       ▼
┌─────────────────────┐
│   Login.jsx         │
│  - Validates input  │
│  - Dispatches       │
│    login()          │
└──────┬──────────────┘
       │ 2. Redux action
       ▼
┌─────────────────────┐
│   authSlice.js      │
│  - login thunk      │
└──────┬──────────────┘
       │ 3. API call
       ▼
┌─────────────────────┐
│  authService.js     │
│  - loginUser()      │
│  - POST /login      │
└──────┬──────────────┘
       │ 4. HTTP Request
       ▼
┌─────────────────────────────┐
│  Backend: Express Server    │
│  /api/auth/login route      │
└──────┬──────────────────────┘
       │ 5. Route handler
       ▼
┌──────────────────────────────┐
│  authController.js           │
│  - loginUser()               │
│  - Validate credentials      │
│  - Find user in DB           │
│  - Compare password (bcrypt) │
│  - Check account status      │
│  - Update lastLogin          │
│  - Generate JWT              │
│  - Generate refresh token    │
└──────┬───────────────────────┘
       │ 6. Response
       │    {success, message, token, user}
       ▼
┌─────────────────────┐
│  authService.js     │
│  - Receive response │
│  - Save to          │
│    localStorage     │
└──────┬──────────────┘
       │ 7. Return data
       ▼
┌─────────────────────┐
│   authSlice.js      │
│  - Update state     │
│  - user: {...}      │
│  - token: "..."     │
└──────┬──────────────┘
       │ 8. State updated
       ▼
┌─────────────────────┐
│   Login.jsx         │
│  - Redirect to      │
│    /products        │
│  - Show success msg │
└─────────────────────┘
```

## Protected Route Access
```
┌─────────────┐
│   Browser   │
│  (Navigate  │
│  to /orders)│
└──────┬──────┘
       │ 1. Navigation request
       ▼
┌─────────────────────┐
│  PrivateRoute.jsx   │
│  - Check token in   │
│    localStorage     │
└──────┬──────────────┘
       │ 2. Token exists? → Yes
       ▼
┌─────────────────────┐
│   Orders.jsx        │
│  - Component loads  │
│  - Fetch orders     │
└──────┬──────────────┘
       │ 3. API request
       ▼
┌─────────────────────┐
│  axios.js           │
│  - Request          │
│    interceptor      │
│  - Add header:      │
│    Authorization:   │
│    Bearer <token>   │
└──────┬──────────────┘
       │ 4. HTTP GET /api/orders
       ▼
┌─────────────────────────────┐
│  Backend: Express Server    │
│  /api/orders route          │
└──────┬──────────────────────┘
       │ 5. Middleware
       ▼
┌──────────────────────────────┐
│  auth.middleware.js          │
│  - protect()                 │
│  - Extract token from header │
│  - Verify JWT signature      │
│  - Decode payload            │
│  - Find user by ID           │
│  - Check account status      │
│  - Attach user to req        │
└──────┬───────────────────────┘
       │ 6. Valid? → Yes
       ▼
┌──────────────────────────────┐
│  orderController.js          │
│  - Access req.user           │
│  - Fetch user's orders       │
│  - Return response           │
└──────┬───────────────────────┘
       │ 7. Response {orders: [...]}
       ▼
┌─────────────────────┐
│   Orders.jsx        │
│  - Display orders   │
└─────────────────────┘
```

## Unauthorized Access (Token Invalid/Expired)
```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. API request with invalid/expired token
       ▼
┌─────────────────────────────┐
│  Backend: Express Server    │
└──────┬──────────────────────┘
       │ 2. Middleware
       ▼
┌──────────────────────────────┐
│  auth.middleware.js          │
│  - protect()                 │
│  - Verify JWT fails          │
│  - Return 401                │
└──────┬───────────────────────┘
       │ 3. Response: 401 Unauthorized
       ▼
┌─────────────────────┐
│  axios.js           │
│  - Response         │
│    interceptor      │
│  - Detect 401       │
│  - Clear storage    │
│  - Redirect /login  │
└──────┬──────────────┘
       │ 4. Redirect
       ▼
┌─────────────────────┐
│   Login.jsx         │
│  - Show login form  │
└─────────────────────┘
```

## Logout Flow
```
┌─────────────┐
│   Browser   │
│  (Navbar)   │
└──────┬──────┘
       │ 1. User clicks Logout
       ▼
┌─────────────────────┐
│   Navbar.jsx        │
│  - Dispatches       │
│    logout()         │
└──────┬──────────────┘
       │ 2. Redux action
       ▼
┌─────────────────────┐
│   authSlice.js      │
│  - logout reducer   │
│  - Clear state      │
│  - Clear storage    │
└──────┬──────────────┘
       │ 3. Optional: API call
       ▼
┌─────────────────────┐
│  authService.js     │
│  - logoutUser()     │
│  - GET /logout      │
│  - Clear storage    │
└──────┬──────────────┘
       │ 4. HTTP GET
       ▼
┌─────────────────────────────┐
│  Backend: Express Server    │
│  /api/auth/logout route     │
└──────┬──────────────────────┘
       │ 5. Route handler
       ▼
┌──────────────────────────────┐
│  authController.js           │
│  - logoutUser()              │
│  - Clear refresh token       │
│    cookie                    │
└──────┬───────────────────────┘
       │ 6. Response {success, message}
       ▼
┌─────────────────────┐
│   Navbar.jsx        │
│  - Show toast       │
│  - Redirect to /    │
└─────────────────────┘
```

## Key Components

### Frontend
- **Login.jsx** - Login form component
- **RegisterForm.jsx** - Registration form component
- **PrivateRoute.jsx** - Route guard for protected routes
- **authSlice.js** - Redux slice for auth state
- **authService.js** - API service for auth endpoints
- **axios.js** - Axios instance with interceptors
- **useAuth.js** - Custom hook for auth state

### Backend
- **authController.js** - Auth request handlers
- **auth.middleware.js** - JWT verification middleware
- **User.js** - User model with password hashing
- **auth.routes.js** - Auth route definitions

## Data Flow

### Token Storage
```
Backend generates JWT
     ↓
Response: { token: "...", user: {...} }
     ↓
authService.js saves to localStorage
     ↓
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: "{"_id":"...","firstName":"John",...}"
}
     ↓
Redux state updated
     ↓
{
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    user: { _id: "...", firstName: "John", ... }
  }
}
```

### Token Usage
```
User makes API request
     ↓
axios interceptor reads localStorage.getItem('token')
     ↓
Adds to request headers
     ↓
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ↓
Backend middleware extracts token
     ↓
Verifies with JWT_SECRET
     ↓
Decodes payload: { id: "...", role: "buyer" }
     ↓
Finds user in database
     ↓
Attaches to req.user
     ↓
Controller accesses req.user
```
