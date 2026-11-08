const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Load environment variables (supports root and server folder execution)
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config(); // fallback to current working directory

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request Logger
app.use((req, res, next) => {
  console.log(`📡 [${new Date().toLocaleTimeString('ar-EG')}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: '🚀 سيرفر منصة سيرتي (Seerati) يعمل بنجاح!',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/cv', require('./routes/cv.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

// Serve Angular static frontend when built (Production ready single-service deployment)
const clientDistPath = path.join(__dirname, '../../client/dist/client/browser');

if (fs.existsSync(clientDistPath)) {
  console.log(`📦 Serving compiled client from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(clientDistPath, 'index.html'));
    }
    next();
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'حدث خطأ غير متوقع في الخادم'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});
