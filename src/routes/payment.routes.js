const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const { paymentRateLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const {
  createIntentValidators,
  confirmIntentValidators,
  retrieveIntentValidators,
  refundValidators,
} = require('../validators/payment.validators');
const {
  createIntent,
  confirmIntent,
  retrieveIntent,
  refund,
} = require('../controllers/payment.controller');

router.use(authenticate);
router.use(paymentRateLimiter);

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Stripe payment intent management
 */

/**
 * @swagger
 * /api/payments/create-intent:
 *   post:
 *     summary: Create a Stripe payment intent
 *     tags: [Payments]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateIntentRequest'
 *     responses:
 *       201:
 *         description: Payment intent created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentIntent'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/create-intent', createIntentValidators, validate, createIntent);

/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm a payment intent
 *     tags: [Payments]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ConfirmIntentRequest'
 *     responses:
 *       200:
 *         description: Payment intent confirmed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentIntent'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/confirm', confirmIntentValidators, validate, confirmIntent);

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Retrieve a payment intent
 *     tags: [Payments]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Stripe payment intent ID (pi_...)
 *     responses:
 *       200:
 *         description: Payment intent details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentIntent'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', retrieveIntentValidators, validate, retrieveIntent);

/**
 * @swagger
 * /api/payments/refund:
 *   post:
 *     summary: Issue a refund for a payment intent
 *     tags: [Payments]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefundRequest'
 *     responses:
 *       200:
 *         description: Refund issued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Refund'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */
router.post('/refund', refundValidators, validate, refund);

module.exports = router;
