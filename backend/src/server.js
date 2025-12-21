
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { errorHandler, notFound } from './middleware/error.middleware.js';


import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import userRoutes from './routes/users.routes.js';
import categoryRoutes from './routes/category.routes.js';
import reviewRoutes from './routes/review.routes.js';
import adminRoutes from './routes/admin.routes.js';



// Initialize Express app
const app = express();



// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());

// security middleware
app.use(helmet());

// CORS 
const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
//
// logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// health check route
app.get('/health', (req, res) => {
    res.status(200).json({ 
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString() 
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);


// root route
app.get('/', (req, res) => {
    res.status(200).json({ 
        success: true,
        message: 'Welcome to the API',
    });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Marketplace API server 
        Environment:  ${process.env.NODE_ENV || 'development'}
        Port:  ${PORT}
        Time: ${new Date().toISOString()}`);
});

// handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

export default app;