const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', 'server', '.env') });

const connectDB = require('../server/config/db');
const app = require('../server/app');

// Connect to MongoDB (with caching for serverless)
let isConnected = false;

const connectWithRetry = async () => {
  if (isConnected) return;
  await connectDB();
  isConnected = true;
};

// Wrap the app to ensure DB connection
module.exports = async (req, res) => {
  await connectWithRetry();
  return app(req, res);
};
