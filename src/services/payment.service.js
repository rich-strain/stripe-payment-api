const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const AppError = require('../utils/AppError');

async function createPaymentIntent({ amount, currency = 'usd', reference }) {
  const params = {
    amount,
    currency,
    metadata: {},
  };
  if (reference) {
    params.metadata.reference = reference;
  }
  return stripe.paymentIntents.create(params);
}

async function confirmPaymentIntent({ paymentIntentId, paymentMethodId }) {
  try {
    return await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
    });
  } catch (err) {
    throw new AppError(err.message, 400);
  }
}

async function retrievePaymentIntent(id) {
  try {
    return await stripe.paymentIntents.retrieve(id);
  } catch (err) {
    throw new AppError(err.message, 404);
  }
}

async function refundPaymentIntent({ paymentIntentId, amount }) {
  const params = { payment_intent: paymentIntentId };
  if (amount) {
    params.amount = amount;
  }
  try {
    return await stripe.refunds.create(params);
  } catch (err) {
    throw new AppError(err.message, 400);
  }
}

module.exports = {
  createPaymentIntent,
  confirmPaymentIntent,
  retrievePaymentIntent,
  refundPaymentIntent,
};
