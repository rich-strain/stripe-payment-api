require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const { CORS_ORIGIN, NODE_ENV } = require('./config/env');
const { swaggerSpec, swaggerUi } = require('../swagger/swagger');
const errorHandler = require('./middleware/errorHandler');

const apiKeyRoutes = require('./routes/apiKey.routes');
const paymentRoutes = require('./routes/payment.routes');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN }));
if (NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Webhook route must receive raw body for Stripe signature verification
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

app.use(express.json());

app.use('/api/keys', apiKeyRoutes);
app.use('/api/payments', paymentRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
