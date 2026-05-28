const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PaymentEvent = require('../models/paymentEvent.model');
const AppError = require('../utils/AppError');

function constructEvent(rawBody, signature, secret) {
  try {
    return stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    throw new AppError(`Webhook signature verification failed: ${err.message}`, 400);
  }
}

async function processEvent(event) {
  const existing = await PaymentEvent.findOne({ stripeEventId: event.id });
  if (existing) {
    return { duplicate: true };
  }

  await PaymentEvent.create({
    stripeEventId: event.id,
    type: event.type,
    payload: event,
  });

  console.log(`Webhook event received: ${event.type} (${event.id})`);
  return { duplicate: false, type: event.type };
}

module.exports = { constructEvent, processEvent };
