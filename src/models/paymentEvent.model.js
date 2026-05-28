const mongoose = require('mongoose');

const paymentEventSchema = new mongoose.Schema({
  stripeEventId: { type: String, required: true, unique: true },
  type:          { type: String, required: true },
  payload:       { type: Object },
  processedAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('PaymentEvent', paymentEventSchema);
