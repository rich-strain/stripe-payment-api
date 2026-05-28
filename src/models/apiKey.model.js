const mongoose = require('mongoose');

const apiKeySchema = new mongoose.Schema({
  keyHash: { type: String, required: true, unique: true },
  name:    { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastUsedAt: { type: Date },
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model('ApiKey', apiKeySchema);
