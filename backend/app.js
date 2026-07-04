require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { connectDB } = require('./config/db');
const { bootstrapAdmin } = require('./utils/bootstrapAdmin');
const leadsRoutes = require('./routes/leads');
const authRoutes = require('./routes/auth');

const app = express();
// Render runs behind a reverse proxy; trust first proxy for client IP/rate limiting.
app.set('trust proxy', 1);
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5500,https://*.vercel.app,https://*.vercel.dev')
  .split(',')
  .map((origin) => origin.trim().toLowerCase())
  .filter(Boolean);

const allowedOriginPatterns = (process.env.FRONTEND_URL_REGEX || '')
  .split(',')
  .map((pattern) => pattern.trim())
  .filter(Boolean)
  .map((pattern) => {
    try {
      return new RegExp(pattern);
    } catch (error) {
      console.warn(`Invalid FRONTEND_URL_REGEX pattern ignored: ${pattern}`);
      return null;
    }
  })
  .filter(Boolean);

function isOriginAllowed(origin) {
  if (!origin) return true; // same-origin / file:// / curl

  const normalizedOrigin = origin.toLowerCase();
  if (allowedOrigins.includes(normalizedOrigin)) return true;
  if (allowedOriginPatterns.some((pattern) => pattern.test(normalizedOrigin))) return true;

  // Allow local development origins.
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) return true;

  // Allow common deployment hosts for the public frontend.
  if (
    /^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(vercel\.app|vercel\.dev|netlify\.app|github\.dev)(:\d+)?$/i.test(origin) ||
    /^https:\/\/[a-z0-9-]+(?:\.[a-z0-9-]+)*\.onrender\.com$/i.test(origin)
  ) {
    return true;
  }

  return false;
}

// Health check should remain available even if DB is temporarily down.
app.get('/api/health', async (req, res) => {
  try {
    await connectDB();
    return res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date(),
    });
  } catch (error) {
    return res.status(503).json({
      status: 'degraded',
      database: 'disconnected',
      error: 'Database connection failed',
      message: error.message,
      timestamp: new Date(),
    });
  }
});

// Public config used by the frontend so it can discover the API base without a hardcoded URL.
app.get('/api/config', (req, res) => {
  const requestOrigin = `${req.protocol}://${req.get('host')}`;
  const backendUrl = process.env.BACKEND_URL || requestOrigin;

  res.status(200).json({
    apiBaseUrl: backendUrl,
    backendUrl,
    status: 'ok',
  });
});

// Middleware
app.use(
  cors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    origin(origin, callback) {
      if (isOriginAllowed(origin)) {
        return callback(null, true);
      }
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(null, false);
    },
  })
);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Ensure database connection is established in both server and serverless runtimes.
app.use(async (req, res, next) => {
  if (req.path === '/api/health' || req.path === '/api/config') {
    return next();
  }

  try {
    await connectDB();
    await bootstrapAdmin();
    return next();
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    return res.status(500).json({
      error: 'Database connection failed',
      message: 'Please try again shortly.',
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = app;