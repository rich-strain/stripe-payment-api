const apiKeyService = require('../services/apiKey.service');

async function generateKey(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(422).json({ error: 'name is required' });
    }
    const { rawKey, apiKey } = await apiKeyService.generateApiKey(name);
    res.status(201).json({
      message: 'API key generated. Store the raw key securely — it will not be shown again.',
      key: rawKey,
      id: apiKey._id,
      name: apiKey.name,
      createdAt: apiKey.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

async function listKeys(req, res, next) {
  try {
    const keys = await apiKeyService.listApiKeys();
    res.json({ keys });
  } catch (err) {
    next(err);
  }
}

async function revokeKey(req, res, next) {
  try {
    const apiKey = await apiKeyService.revokeApiKey(req.params.id);
    res.json({ message: 'API key revoked', id: apiKey._id, name: apiKey.name });
  } catch (err) {
    next(err);
  }
}

module.exports = { generateKey, listKeys, revokeKey };
