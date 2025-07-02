
# E-Commerce Backend API

A complete Node.js Express backend for the e-commerce application with MySQL database.

## Features

- 🔐 JWT-based authentication (register/login/logout)
- 📦 Product management with filtering and search
- 🛒 Shopping cart functionality
- 📋 Order management
- 💬 Contact form handling
- 📊 MySQL database with proper relationships
- 🔒 Protected routes with middleware
- ✅ Input validation with Joi
- 🚀 CORS enabled for frontend integration

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MySQL server running locally
- Git

### Installation

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your configuration.

4. **Set up database:**
   ```bash
   npm run setup
   ```
   This will create the database, tables, and insert sample data.

5. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout user (protected)

### Products
- `GET /api/products` - Get all products (with filtering/search)
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories/list` - Get all categories

### Cart
- `GET /api/cart` - Get user's cart (protected)
- `POST /api/cart/add` - Add item to cart (protected)
- `PUT /api/cart/update/:cartId` - Update cart item (protected)
- `DELETE /api/cart/remove/:productId` - Remove from cart (protected)
- `DELETE /api/cart/clear` - Clear cart (protected)

### Orders
- `POST /api/orders/create` - Create order from cart (protected)
- `GET /api/orders` - Get user's orders (protected)
- `GET /api/orders/:id` - Get single order (protected)

### Contact
- `POST /api/contact` - Submit contact form

## Database Schema

The database includes the following tables:
- `users` - User accounts
- `products` - Product catalog
- `cart` - Shopping cart items
- `wishlist` - User favorites
- `orders` - Order records
- `order_items` - Order line items
- `contact_messages` - Contact form submissions

## Environment Variables

Create a `.env` file with these variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ecommerce
DB_PORT=3306
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Frontend Integration

The backend is designed to work with your React frontend. Make sure to:

1. Update your frontend's API base URL to `http://localhost:5000/api`
2. Include JWT tokens in Authorization headers for protected routes
3. Handle authentication state in your frontend

## Development

- Use `npm run dev` for development with auto-restart
- Check `http://localhost:5000/api/health` for server status
- All routes are prefixed with `/api`
- CORS is configured for `http://localhost:3000`

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation with Joi
- SQL injection protection with parameterized queries
- CORS configuration for specific origins

## Support

If you encounter any issues:
1. Ensure MySQL is running and accessible
2. Check that all environment variables are set correctly
3. Verify that the database was created successfully
4. Check the console logs for detailed error messages
