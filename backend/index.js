import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import {v2 as cloudinary} from 'cloudinary';


// Import routes
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import postRoutes from './routes/post.route.js';
import notificationRoutes from './routes/notification.route.js';
import connectDB from './db/connectDB.js';
import cookieParser from 'cookie-parser';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();




const PORT = process.env.PORT || 3000;


// Middleware to parse JSON bodies
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ extended: true }));
// Middleware to parse cookies
app.use(cookieParser());
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));




// Import routes

app.get('/', (req, res) => {
  res.send('Welcome to the backend server!!');
});
// Example route

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications',notificationRoutes);


app.listen(PORT, () => {
    // Start the server
    connectDB()
  console.log('Backend server is running on http://localhost:' + PORT);
});
