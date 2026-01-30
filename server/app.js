const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sanitize = require('./middleware/sanitize');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// Global middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "blob:", "https://images.unsplash.com"],
      connectSrc: ["'self'"],
    },
  },
}));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(sanitize);

// Only apply rate limiting outside of tests
if (process.env.NODE_ENV !== 'test') {
  app.use(generalLimiter);
}

// Static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/quotes', require('./routes/quotes'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/team', require('./routes/team'));
app.use('/api/company', require('./routes/company'));
app.use('/api/upload', require('./routes/upload'));

// Serve React frontend (built app)
const clientBuild = path.join(__dirname, '..', 'build');
app.use(express.static(clientBuild));
app.get('{*path}', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

// Global error handler
app.use(errorHandler);

module.exports = app;
