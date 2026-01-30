const rateLimit = require('express-rate-limit');

const isTest = process.env.NODE_ENV === 'test';

const noopLimiter = (req, res, next) => next();

const generalLimiter = isTest
  ? noopLimiter
  : rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: {
          message: 'Too many requests, please try again later',
          code: 'RATE_LIMIT',
        },
      },
    });

const authLimiter = isTest
  ? noopLimiter
  : rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        error: {
          message: 'Too many auth attempts, please try again later',
          code: 'RATE_LIMIT',
        },
      },
    });

module.exports = { generalLimiter, authLimiter };
