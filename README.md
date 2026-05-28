# Stripe Payment API

A production-grade REST API demonstrating real-world Stripe payment integration built for a developer portfolio. Covers payment intent lifecycle, refunds, webhook handling with idempotency, and API key authentication.

## What it demonstrates

- **Stripe integration** — create, confirm, retrieve, and refund payment intents
- **Webhook processing** — Stripe signature verification and idempotent event handling using MongoDB's unique index on `stripeEventId`
- **API key auth** — SHA-256 hashed keys stored in MongoDB, validated on every protected request
- **Clean architecture** — thin controllers, service layer for all business logic, separated `app.js` / `server.js` for testability
- **Production patterns** — rate limiting, input validation, global error handler, environment variable validation at startup, Docker-ready

## Tech stack

Node.js · Express · MongoDB Atlas · Mongoose · Stripe Node SDK · swagger-ui-express · helmet · morgan · cors · express-rate-limit · express-validator

## Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (free tier works)
- Stripe account (test mode keys)
- (Optional) Docker & Docker Compose
- (Optional) Stripe CLI for local webhook testing

## Local setup

```bash
git clone <repo-url>
cd stripe-payment-api
npm install
cp .env.example .env
```

Fill in `.env`:

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/stripe-api
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

Start the server:

```bash
npm run dev
```

## Generating a test API key

```bash
npm run seed
```

The script connects to MongoDB, creates a hashed key, and prints the raw key once:

```
========================================
Test API key generated successfully.
Use this key in the X-API-Key header:

  a1b2c3d4e5f6...

Store it securely — it will NOT be shown again.
========================================
```

## Using the API key

Pass the key in every payment request:

```
X-API-Key: a1b2c3d4e5f6...
```

Example with curl:

```bash
curl -X POST http://localhost:3000/api/payments/create-intent \
  -H "Content-Type: application/json" \
  -H "X-API-Key: a1b2c3d4e5f6..." \
  -d '{"amount": 2000, "currency": "usd", "reference": "order_123"}'
```

## Swagger docs

Interactive API documentation is available at:

```
http://localhost:3000/api-docs
```

## Endpoints

### API Keys
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/keys/generate` | Generate a new API key |
| GET | `/api/keys` | List all keys (no raw keys returned) |
| DELETE | `/api/keys/:id` | Revoke a key |

### Payments (require `X-API-Key`)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/payments/create-intent` | Create a payment intent |
| POST | `/api/payments/confirm` | Confirm a payment intent |
| GET | `/api/payments/:id` | Retrieve a payment intent |
| POST | `/api/payments/refund` | Issue a full or partial refund |

### Webhooks
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/webhooks/stripe` | Receive Stripe events (no API key — Stripe signs its own requests) |

## Stripe test card numbers

| Card | Number | Use |
|------|--------|-----|
| Visa (success) | `4242 4242 4242 4242` | Any future date, any CVC |
| Decline | `4000 0000 0000 0002` | Always declined |
| Requires auth | `4000 0025 0000 3155` | Triggers 3D Secure |

Use `pm_card_visa` as the `paymentMethodId` when confirming intents in test mode.

## Testing webhooks locally

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Log in: `stripe login`
3. Forward events to your local server:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

4. Copy the `whsec_...` secret the CLI prints and set it as `STRIPE_WEBHOOK_SECRET` in `.env`
5. Trigger a test event:

```bash
stripe trigger payment_intent.succeeded
```

## Docker

```bash
docker compose up --build
```

The container reads from `.env` and exposes port 3000.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default `3000`) |
| `NODE_ENV` | No | `development` or `production` |
| `MONGO_URI` | **Yes** | MongoDB Atlas connection string |
| `STRIPE_SECRET_KEY` | **Yes** | Stripe secret key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | **Yes** | Stripe webhook signing secret (`whsec_...`) |
| `CORS_ORIGIN` | No | Allowed CORS origin (default `http://localhost:3000`) |
