const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    err = new AppError(`Duplicate value for ${field}`, 409);
  }

  // Mongoose cast error (invalid ObjectId etc.)
  if (err.name === 'CastError') {
    err = new AppError(`Invalid value for ${err.path}`, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message).join(', ');
    err = new AppError(messages, 400);
  }

  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'Internal server error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  res.status(statusCode).json({ error: message });
}

module.exports = errorHandler;
