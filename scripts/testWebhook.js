require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const http = require('http');

const secret = process.env.STRIPE_WEBHOOK_SECRET;
const PORT = process.env.PORT || 3000;

function sendWebhook(payload) {
  const body = JSON.stringify(payload);
  const signature = stripe.webhooks.generateTestHeaderString({
    payload: body,
    secret,
  });

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: PORT,
        path: '/api/webhooks/stripe',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          'stripe-signature': signature,
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
      }
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function run() {
  const eventId = `evt_test_${Date.now()}`;

  const payload = {
    id: eventId,
    object: 'event',
    type: 'payment_intent.succeeded',
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    data: {
      object: {
        id: 'pi_test_123',
        object: 'payment_intent',
        amount: 2000,
        currency: 'usd',
        status: 'succeeded',
      },
    },
  };

  console.log('\n=== Test 1: New event ===');
  const res1 = await sendWebhook(payload);
  console.log(`Status: ${res1.status}`);
  console.log('Response:', res1.body);
  console.log('Expected: { received: true, duplicate: false }');

  console.log('\n=== Test 2: Duplicate event (same ID) ===');
  const res2 = await sendWebhook(payload);
  console.log(`Status: ${res2.status}`);
  console.log('Response:', res2.body);
  console.log('Expected: { received: true, duplicate: true }');

  console.log('\n=== Test 3: Bad signature ===');
  const badBody = JSON.stringify({ id: 'evt_bad', type: 'fake' });
  const result = await new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: PORT,
        path: '/api/webhooks/stripe',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(badBody),
          'stripe-signature': 't=123,v1=badhash',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
      }
    );
    req.on('error', reject);
    req.write(badBody);
    req.end();
  });
  console.log(`Status: ${result.status}`);
  console.log('Response:', result.body);
  console.log('Expected: 400 + signature error');
}

run().catch(console.error);
