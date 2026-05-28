const crypto = require('crypto');

function hashKey(rawKey) {
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}

function generateRawKey() {
  return crypto.randomBytes(32).toString('hex');
}

module.exports = { hashKey, generateRawKey };
