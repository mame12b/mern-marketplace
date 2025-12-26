# Authentication Testing & Verification Guide

## Quick Start

### Prerequisites
- MongoDB running on `localhost:27017`
- Node.js installed
- Backend running on port 5000
- Frontend running on port 5173

### Start Backend
```bash
cd backend
npm install
npm run dev
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## Run Authentication Tests

### Automated Script Test
```bash
./test-auth.sh
```

This will test:
- ✓ Health check endpoint
- ✓ User registration
- ✓ User login
- ✓ Protected route access
- ✓ Invalid token rejection
- ✓ Logout functionality

### Manual Testing via Browser

1. **Open Frontend**: http://localhost:5173

2. **Register a New User**
   - Navigate to `/register`
   - Fill in the form:
     - First Name: John
     - Last Name: Doe
     - Email: john@example.com
     - Password: password123
     - Confirm Password: password123
     - Role: buyer
   - Click "Sign Up"
   - Should redirect to products page
   - Check browser DevTools > Application > Local Storage
     - `token` should be present
     - `user` should contain user object

3. **Test Login**
   - Logout if logged in
   - Navigate to `/login`
   - Enter credentials:
     - Email: john@example.com
     - Password: password123
   - Click "Sign In"
   - Should redirect to products page

4. **Test Protected Routes**
   - Navigate to `/profile`
   - Should display user profile (requires authentication)
   - If not logged in, should redirect to `/login`

5. **Test Logout**
   - Click on user dropdown in navbar
   - Click "Logout"
   - Should clear localStorage
   - Should redirect to home page

## Manual API Testing with cURL

### 1. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "buyer"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "buyer",
    ...
  }
}
```

### 2. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "buyer",
    ...
  }
}
```

### 3. Get Current User (Protected)
```bash
# Replace YOUR_TOKEN with actual token from login/register
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "buyer",
    "wishlist": [],
    "cart": [],
    ...
  }
}
```

### 4. Logout
```bash
curl -X GET http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Testing with Postman

### Setup
1. Import collection with these endpoints:
   - POST `{{baseUrl}}/api/auth/register`
   - POST `{{baseUrl}}/api/auth/login`
   - GET `{{baseUrl}}/api/auth/me`
   - GET `{{baseUrl}}/api/auth/logout`

2. Create environment variable:
   - `baseUrl`: http://localhost:5000

### Test Flow
1. **Register** → Copy `token` from response
2. **Set Authorization** → Bearer Token → Paste token
3. **Get Me** → Verify user data returned
4. **Logout** → Clear token

## Common Issues & Solutions

### Issue: "Not authorized to access this route"
**Solution:** 
- Check if token is being sent in Authorization header
- Verify token hasn't expired (24h default)
- Check browser localStorage has `token` key

### Issue: "Invalid credentials"
**Solution:**
- Verify email and password are correct
- Check if user exists in database
- Ensure password meets minimum requirements (6 characters)

### Issue: "User already exists"
**Solution:**
- User with this email is already registered
- Try logging in instead
- Use different email for testing

### Issue: CORS errors in browser
**Solution:**
- Check backend .env has correct CLIENT_URL (http://localhost:5173)
- Verify backend cors middleware is configured
- Ensure withCredentials: true in frontend axios config

### Issue: Token not being saved
**Solution:**
- Check browser DevTools Console for errors
- Verify authService.js persistSession is working
- Check Redux DevTools for state updates

## Verify Authentication State

### Check Redux State (Frontend)
Open Redux DevTools in browser and check `auth` state:
```javascript
{
  user: {
    _id: "...",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "buyer",
    ...
  },
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  loading: false,
  error: null,
  message: ""
}
```

### Check LocalStorage (Frontend)
DevTools > Application > Local Storage > http://localhost:5173
- `token`: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
- `user`: "{\"_id\":\"...\",\"firstName\":\"John\",...}"

### Check MongoDB (Backend)
```bash
mongosh
use marketplace
db.users.find().pretty()
```

Should see registered users with hashed passwords.

## Security Checklist

- ✅ Passwords hashed with bcrypt
- ✅ JWT tokens with expiration
- ✅ HTTP-only cookies for refresh tokens
- ✅ CORS configured properly
- ✅ Authorization checks on protected routes
- ✅ Account status validation
- ✅ Role-based access control
- ⚠️ Rate limiting (recommended)
- ⚠️ Account lockout after failed attempts (recommended)

## Demo Accounts

Create these accounts for testing different roles:

```bash
# Admin Account
{
  "firstName": "Admin",
  "lastName": "User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}

# Seller Account
{
  "firstName": "Seller",
  "lastName": "User",
  "email": "seller@example.com",
  "password": "seller123",
  "role": "seller"
}

# Buyer Account
{
  "firstName": "Buyer",
  "lastName": "User",
  "email": "buyer@example.com",
  "password": "buyer123",
  "role": "buyer"
}
```

## Next Steps

1. ✅ Basic authentication working
2. 🔄 Implement email verification
3. 🔄 Add refresh token rotation
4. 🔄 Implement password reset email
5. 🔄 Add rate limiting
6. 🔄 Add account lockout
7. 🔄 Implement 2FA (optional)
8. 🔄 Add session management
