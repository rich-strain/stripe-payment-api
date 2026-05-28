const router = require('express').Router();
const { generateKey, listKeys, revokeKey } = require('../controllers/apiKey.controller');

/**
 * @swagger
 * tags:
 *   name: API Keys
 *   description: API key management
 */

/**
 * @swagger
 * /api/keys/generate:
 *   post:
 *     summary: Generate a new API key
 *     tags: [API Keys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GenerateKeyRequest'
 *     responses:
 *       201:
 *         description: API key generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GenerateKeyResponse'
 *       422:
 *         $ref: '#/components/responses/ValidationError'
 */
router.post('/generate', generateKey);

/**
 * @swagger
 * /api/keys:
 *   get:
 *     summary: List all API keys
 *     tags: [API Keys]
 *     responses:
 *       200:
 *         description: List of API keys (hashed keys not included)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListKeysResponse'
 */
router.get('/', listKeys);

/**
 * @swagger
 * /api/keys/{id}:
 *   delete:
 *     summary: Revoke an API key
 *     tags: [API Keys]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the API key
 *     responses:
 *       200:
 *         description: API key revoked
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RevokeKeyResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', revokeKey);

module.exports = router;
