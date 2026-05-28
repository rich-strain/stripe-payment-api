const { body, param } = require('express-validator');

const createIntentValidators = [
  body('amount')
    .isInt({ min: 1 })
    .withMessage('amount must be a positive integer (smallest currency unit)'),
  body('currency')
    .optional()
    .isString()
    .isLength({ min: 3, max: 3 })
    .withMessage('currency must be a 3-letter ISO code'),
  body('reference')
    .optional()
    .isString()
    .withMessage('reference must be a string'),
];

const confirmIntentValidators = [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('paymentIntentId is required'),
  body('paymentMethodId')
    .notEmpty()
    .withMessage('paymentMethodId is required'),
];

const retrieveIntentValidators = [
  param('id')
    .notEmpty()
    .withMessage('Payment intent ID is required'),
];

const refundValidators = [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('paymentIntentId is required'),
  body('amount')
    .optional()
    .isInt({ min: 1 })
    .withMessage('amount must be a positive integer'),
];

module.exports = {
  createIntentValidators,
  confirmIntentValidators,
  retrieveIntentValidators,
  refundValidators,
};
