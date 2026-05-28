const router = require('express').Router();
const { handleStripeWebhook } = require('../controllers/webhook.controller');

/**
 * @swagger
 * tags:
 *   name: Webhooks
 *   description: Stripe webhook receiver
 */

/**
 * @swagger
 * /api/webhooks/stripe:
 *   post:
 *     summary: Receive Stripe webhook events
 *     tags: [Webhooks]
 *     description: >
 *       This endpoint is called by Stripe to deliver events. It verifies the
 *       Stripe-Signature header and processes events idempotently using the
 *       stripeEventId unique index.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Event received
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 received:
 *                   type: boolean
 *                 duplicate:
 *                   type: boolean
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/stripe', handleStripeWebhook);

module.exports = router;
