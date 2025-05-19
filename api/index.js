const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();

// Middleware setup
const allowedOrigins = [
  'https://mern-auth-react.vercel.app',
  'http://localhost:5173',
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
mongoose
  .connect(process.env.URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const authRoutes = require('../routes/authRoutes');
app.use('/api', authRoutes);

// Export as serverless function
module.exports = { handler: serverless(app) };
