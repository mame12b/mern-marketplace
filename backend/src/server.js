
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
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
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