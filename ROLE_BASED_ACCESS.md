# Role-Based Access Control (RBAC) System

## Overview
The marketplace now has a complete role-based access control system with three distinct user roles:
- **Buyer** - Can browse and purchase products
- **Seller** - Can sell products and manage their store
- **Admin** - Can manage the entire platform

## User Roles

### 1. Buyer Role
**Permissions:**
- Browse products
- Add to cart and checkout
- Manage wishlist
- View and track orders
- Manage profile

**Dashboard:** `/buyer/dashboard`
- View order statistics
- Quick access to cart and wishlist
- Track recent orders
- Browse products

### 2. Seller Role
**Permissions:**
- All buyer permissions
- Create and manage products
- View sales analytics
- Manage orders for their products
- Manage shop profile

**Dashboard:** `/seller/dashboard`
- View sales statistics
- Product management
- Order fulfillment
- Analytics and insights
- Shop settings

### 3. Admin Role
**Permissions:**
- All platform access
- User management
- Product moderation
- Platform analytics
- System settings

**Dashboard:** `/admin/dashboard`
- Platform-wide statistics
- User management
- Product management
- Revenue analytics
- System configuration

## Frontend Components

### Authentication Components

#### `RoleBasedRoute.jsx`
Protected route wrapper that checks user roles:
```jsx
<Route element={<RoleBasedRoute allowedRoles={['seller']} />}>
  <Route path='/seller/dashboard' element={<SellerDashboard />} />
</Route>
```

#### `RoleGuard.jsx`
Component-level role protection with custom error UI:
```jsx
<RoleGuard allowedRoles={['admin', 'seller']}>
  <AdminPanel />
</RoleGuard>
```

#### `DashboardRedirect.jsx`
Automatically redirects users to their role-specific dashboard:
```jsx
<Route path='/dashboard' element={<DashboardRedirect />} />
```

### Dashboard Pages

#### `BuyerDashboard.jsx`
- Order statistics
- Wishlist overview
- Cart summary
- Quick actions (Browse, Orders, Wishlist, Profile)
- Recent orders display

#### `SellerDashboard.jsx`
- Product statistics
- Sales metrics
- Order management
- Analytics overview
- Quick actions (Add Product, My Products, Orders, Analytics)

#### `AdminDashboard.jsx`
- Platform statistics (Users, Products, Revenue, Orders)
- User management tools
- Product moderation
- System analytics
- Quick actions (Add Product, Manage Products, Orders, Analytics)

## Routes Structure

### Public Routes
- `/` - Home
- `/products` - Product listing
- `/products/:id` - Product details
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (All Authenticated Users)
- `/dashboard` - Auto-redirects to role-specific dashboard
- `/checkout` - Checkout page
- `/profile` - User profile
- `/orders` - Order history

### Buyer-Only Routes
- `/buyer/dashboard` - Buyer dashboard
- `/wishlist` - Wishlist management
- `/cart` - Shopping cart

### Seller-Only Routes
- `/seller/dashboard` - Seller dashboard
- `/seller/products` - Product management
- `/seller/products/new` - Add new product
- `/seller/orders` - Seller orders
- `/seller/analytics` - Sales analytics

### Admin-Only Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - User management
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/analytics` - Platform analytics
- `/admin/settings` - System settings

## Backend Authorization

### Middleware

#### `protect` - Authentication Check
Verifies JWT token and attaches user to request:
```javascript
router.get('/orders', protect, getOrders);
```

#### `authorize` - Role Check
Checks if user has required role:
```javascript
router.post('/products', protect, authorize('seller', 'admin'), createProduct);
```

### Route Protection Examples

**Admin Routes:**
```javascript
router.use(protect);
router.use(authorize('admin'));
router.get('/users', getAllUsers);
```

**Seller Routes:**
```javascript
router.post('/products', protect, authorize('seller', 'admin'), createProduct);
```

**Multi-Role Routes:**
```javascript
router.put('/products/:id', protect, authorize('seller', 'admin'), updateProduct);
```

## Navigation

### Navbar Role-Based Links
The navbar dynamically shows links based on user role:

**Buyer:**
- Products
- Wishlist
- Cart
- My Dashboard
- Profile
- Orders

**Seller:**
- Products
- Seller Dashboard
- Profile
- Orders

**Admin:**
- Products
- Admin Dashboard
- Profile
- Orders

## Registration Flow

1. User selects role during registration (Buyer or Seller)
2. Admin accounts must be created directly in database or promoted
3. After registration, user is redirected to role-specific dashboard
4. Email verification recommended for production

## Login Flow

1. User enters credentials
2. Backend validates and returns user with role
3. Frontend checks role and redirects:
   - Admin → `/admin/dashboard`
   - Seller → `/seller/dashboard`
   - Buyer → `/buyer/dashboard`

## Role Switching

To change a user's role (Admin only):
```javascript
// Backend route
PUT /api/admin/users/:id/role
{
  "role": "seller" // or "buyer" or "admin"
}
```

## Custom Hooks

### `useAuth.js`
Provides role-checking helpers:
```javascript
const { isAdmin, isSeller, isBuyer, user } = useAuth();

if (isAdmin) {
  // Show admin features
}
```

## Security Considerations

### Frontend
✅ Protected routes with `RoleBasedRoute`
✅ Component-level guards with `RoleGuard`
✅ Conditional rendering based on role
✅ Automatic redirects for unauthorized access
✅ Role displayed in user profile

### Backend
✅ JWT-based authentication
✅ Role-based middleware (`authorize`)
✅ Account status checking (active/suspended)
✅ Protected API endpoints
✅ Role validation on all sensitive operations

## Best Practices

1. **Always use both frontend and backend protection**
   - Frontend for UX
   - Backend for security

2. **Check roles at component level when needed**
   ```jsx
   {user?.role === 'seller' && <AddProductButton />}
   ```

3. **Use middleware consistently**
   ```javascript
   router.use(protect); // Auth check
   router.use(authorize('admin')); // Role check
   ```

4. **Validate role changes**
   - Only admins can change user roles
   - Log all role changes for audit

## Testing Role-Based Access

### As Buyer
1. Register with buyer role
2. Access `/buyer/dashboard` ✅
3. Try `/seller/dashboard` ❌ (Redirected)
4. Try `/admin/dashboard` ❌ (Redirected)

### As Seller
1. Register with seller role
2. Access `/seller/dashboard` ✅
3. Create products ✅
4. Try `/admin/dashboard` ❌ (Redirected)

### As Admin
1. Admin account (created in DB)
2. Access `/admin/dashboard` ✅
3. Access all routes ✅
4. Manage users and products ✅

## Future Enhancements

- [ ] Role hierarchy (Admin > Seller > Buyer)
- [ ] Custom permissions per role
- [ ] Role-based notifications
- [ ] Audit logging for role changes
- [ ] Multi-role support (user can have multiple roles)
- [ ] Role expiration/renewal
- [ ] Role-based pricing
- [ ] Role-based discounts
