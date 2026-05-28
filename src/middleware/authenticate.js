const ApiKey = require('../models/apiKey.model');
const { hashKey } = require('../utils/hash.utils');
const AppError = require('../utils/AppError');

async function authenticate(req, res, next) {
  const raw = req.headers['x-api-key'];
  if (!raw) {
    return next(new AppError('Missing X-API-Key header', 401));
  }

  const keyHash = hashKey(raw);
  const apiKey = await ApiKey.findOne({ keyHash, isActive: true });
  if (!apiKey) {
    return next(new AppError('Invalid or revoked API key', 401));
  }

  apiKey.lastUsedAt = new Date();
  await apiKey.save();

  req.apiKey = apiKey;
  next();
}

module.exports = authenticate;
