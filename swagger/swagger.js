const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Stripe Payment API',
      version: '1.0.0',
      description: `
## Overview
A production-grade REST API demonstrating real-world Stripe payment integration.
This API handles payment intent creation, confirmation, retrieval, refunds, and
Stripe webhook processing with full idempotency guarantees.

## Authentication
All payment endpoints require an API key passed in the \`X-API-Key\` request header.

\`\`\`
X-API-Key: your-api-key-here
\`\`\`

## Getting a Test API Key
Run the seed script to generate a test API key:

\`\`\`bash
npm run seed
\`\`\`

The script will print your raw API key to the console. **Store it securely —
it is shown only once and never stored in plaintext.**

Use the printed key as the value of the \`X-API-Key\` header in all payment requests.
      `,
      contact: {
        name: 'Rich',
        email: 'richardstrain@gmail.com',
      },
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local development' },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
        },
      },
      schemas: {
        GenerateKeyRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'my-app-key',
              description: 'Friendly label for this API key',
            },
          },
        },
        GenerateKeyResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            key: { type: 'string', description: 'Raw API key — shown once only' },
            id: { type: 'string' },
            name: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        ListKeysResponse: {
          type: 'object',
          properties: {
            keys: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  _id: { type: 'string' },
                  name: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  lastUsedAt: { type: 'string', format: 'date-time', nullable: true },
                  isActive: { type: 'boolean' },
                },
              },
            },
          },
        },
        RevokeKeyResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            id: { type: 'string' },
            name: { type: 'string' },
          },
        },
        CreateIntentRequest: {
          type: 'object',
          required: ['amount'],
          properties: {
            amount: {
              type: 'integer',
              minimum: 1,
              example: 2000,
              description: 'Amount in the smallest currency unit (e.g. cents for USD)',
            },
            currency: {
              type: 'string',
              example: 'usd',
              default: 'usd',
              description: '3-letter ISO currency code',
            },
            reference: {
              type: 'string',
              example: 'order_123',
              description: 'Your internal order or reference ID stored in Stripe metadata',
            },
          },
        },
        ConfirmIntentRequest: {
          type: 'object',
          required: ['paymentIntentId', 'paymentMethodId'],
          properties: {
            paymentIntentId: {
              type: 'string',
              example: 'pi_3OxxxxxxxxxxxxxxxxxxxX',
            },
            paymentMethodId: {
              type: 'string',
              example: 'pm_card_visa',
              description: 'Stripe payment method ID or test token',
            },
          },
        },
        RefundRequest: {
          type: 'object',
          required: ['paymentIntentId'],
          properties: {
            paymentIntentId: {
              type: 'string',
              example: 'pi_3OxxxxxxxxxxxxxxxxxxxX',
            },
            amount: {
              type: 'integer',
              minimum: 1,
              example: 1000,
              description: 'Partial refund amount in cents. Omit for a full refund.',
            },
          },
        },
        PaymentIntent: {
          type: 'object',
          description: 'Stripe PaymentIntent object (subset of fields shown)',
          properties: {
            id: { type: 'string', example: 'pi_3OxxxxxxxxxxxxxxxxxxxX' },
            object: { type: 'string', example: 'payment_intent' },
            amount: { type: 'integer', example: 2000 },
            currency: { type: 'string', example: 'usd' },
            status: { type: 'string', example: 'requires_payment_method' },
            client_secret: { type: 'string' },
            metadata: {
              type: 'object',
              properties: { reference: { type: 'string' } },
            },
          },
        },
        Refund: {
          type: 'object',
          description: 'Stripe Refund object (subset of fields shown)',
          properties: {
            id: { type: 'string', example: 're_3OxxxxxxxxxxxxxxxxxxxX' },
            object: { type: 'string', example: 'refund' },
            amount: { type: 'integer', example: 2000 },
            currency: { type: 'string', example: 'usd' },
            status: { type: 'string', example: 'succeeded' },
            payment_intent: { type: 'string' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Descriptive error message' },
          },
        },
      },
      responses: {
        Unauthorized: {
          description: 'Missing or invalid API key',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        ValidationError: {
          description: 'Request validation failed',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerUi };
