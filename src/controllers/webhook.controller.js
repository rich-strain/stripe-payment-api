const webhookService = require('../services/webhook.service');
const { STRIPE_WEBHOOK_SECRET } = require('../config/env');

async function handleStripeWebhook(req, res, next) {
  const signature = req.headers['stripe-signature'];
  if (!signature) {
    return res.status(400).json({ error: 'Missing stripe-signature header' });
  }

  try {
    const event = webhookService.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET);
    const result = await webhookService.processEvent(event);
    res.json({ received: true, duplicate: result.duplicate });
  } catch (err) {
    next(err);
  }
}

module.exports = { handleStripeWebhook };
