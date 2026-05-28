require('dotenv').config();
const { validateEnv, PORT } = require('./config/env');
const { connectDB } = require('./config/db');
const app = require('./app');

validateEnv();

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
