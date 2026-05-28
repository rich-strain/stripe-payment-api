const paymentService = require('../services/payment.service');

async function createIntent(req, res, next) {
  try {
    const { amount, currency, reference } = req.body;
    const intent = await paymentService.createPaymentIntent({ amount, currency, reference });
    res.status(201).json(intent);
  } catch (err) {
    next(err);
  }
}

async function confirmIntent(req, res, next) {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;
    const intent = await paymentService.confirmPaymentIntent({ paymentIntentId, paymentMethodId });
    res.json(intent);
  } catch (err) {
    next(err);
  }
}

async function retrieveIntent(req, res, next) {
  try {
    const intent = await paymentService.retrievePaymentIntent(req.params.id);
    res.json(intent);
  } catch (err) {
    next(err);
  }
}

async function refund(req, res, next) {
  try {
    const { paymentIntentId, amount } = req.body;
    const result = await paymentService.refundPaymentIntent({ paymentIntentId, amount });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { createIntent, confirmIntent, retrieveIntent, refund };
