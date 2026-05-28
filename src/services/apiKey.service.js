const ApiKey = require('../models/apiKey.model');
const { hashKey, generateRawKey } = require('../utils/hash.utils');
const AppError = require('../utils/AppError');

async function generateApiKey(name) {
  const rawKey = generateRawKey();
  const keyHash = hashKey(rawKey);
  const apiKey = await ApiKey.create({ keyHash, name });
  return { rawKey, apiKey };
}

async function listApiKeys() {
  return ApiKey.find({}, '-keyHash').sort({ createdAt: -1 });
}

async function revokeApiKey(id) {
  const apiKey = await ApiKey.findById(id);
  if (!apiKey) {
    throw new AppError('API key not found', 404);
  }
  apiKey.isActive = false;
  await apiKey.save();
  return apiKey;
}

module.exports = { generateApiKey, listApiKeys, revokeApiKey };
