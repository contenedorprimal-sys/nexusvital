import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/auth.js';
import activityRoutes from './routes/activities.js';
import taskRoutes from './routes/tasks.js';
import progressRoutes from './routes/progress.js';
import userRoutes from './routes/users.js';
import aiRoutes from './routes/ai.js';

// Connect to database
connectDB();

const app = express();

// ─── Middleware ─────────────────────────────────────────────

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Cookie parser
app.use(cookieParser());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for auth routes (100 requests per 15 minutes)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Demasiadas solicitudes. Intenta de nuevo en 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Routes ─────────────────────────────────────────────────

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NexusVital API está funcionando correctamente.',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

// ─── Start Server ───────────────────────────────────────────

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 NexusVital server corriendo en puerto ${PORT} [${process.env.NODE_ENV}]`);
});

export default app;
