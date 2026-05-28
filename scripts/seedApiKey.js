require('dotenv').config();
const mongoose = require('mongoose');
const { validateEnv, MONGO_URI } = require('../src/config/env');
const ApiKey = require('../src/models/apiKey.model');
const { generateRawKey, hashKey } = require('../src/utils/hash.utils');

async function seed() {
  validateEnv();
  await mongoose.connect(MONGO_URI);

  const rawKey = generateRawKey();
  const keyHash = hashKey(rawKey);
  const name = 'test-key-1';

  const existing = await ApiKey.findOne({ name });
  if (existing) {
    console.log(`A key named "${name}" already exists. Revoking it and creating a new one.`);
    existing.isActive = false;
    await existing.save();
  }

  await ApiKey.create({ keyHash, name });

  console.log('\n========================================');
  console.log('Test API key generated successfully.');
  console.log('Use this key in the X-API-Key header:');
  console.log(`\n  ${rawKey}\n`);
  console.log('Store it securely — it will NOT be shown again.');
  console.log('========================================\n');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
