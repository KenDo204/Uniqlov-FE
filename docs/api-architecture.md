# UNILO API & Payment Architecture Blueprint

This document specifies the serverless API architecture, database caching rules, and payment gateways hooks (Stripe integration) required for production.

---

## 1. REST API Endpoints Overview

All request bodies are structured in JSON format. Response formats follow unified status pings.

### Product & Catalog Queries
* **`GET /api/products`**
  * Queries and filters the PostgreSQL product list.
  * **Query Parameters**:
    * `category`: `men` | `women` | `essentials` | `active` | `outerwear` | `accessories`
    * `search`: Search keywords matched via full-text search indexes.
    * `limit`: Page count (defaults to 12).
    * `sort`: `price_asc` | `price_desc` | `rating` | `newest`.
  * **Caching Rules**: Cache at the edge (Vercel CDN) for 3600 seconds with `Stale-While-Revalidate` up to 86400 seconds.

* **`GET /api/products/:id`**
  * Returns detailed metadata for a single product, matching colors, sizes, reviews, and coordinate items.
  * **Caching Rules**: Cache-Control: `public, max-age=600, s-maxage=3600`.

### Cart & Discount Systems
* **`POST /api/cart/sync`**
  * Synchronizes local storage carts with authenticated user database accounts.
  * **Payload**: `{ items: [{ variantId: string, size: Size, quantity: number }] }`

* **`POST /api/coupons/validate`**
  * Validates and returns active discount values (e.g. `UNILO10` returns 10%).
  * **Payload**: `{ code: string }`
  * **Response**: `{ valid: boolean, discountPercent: number, error?: string }`

### Transactions & Checkout Pipelines
* **`POST /api/checkout/session`**
  * Initiates secure Stripe checkout sequences, passing purchase totals and line items.
  * **Payload**: `{ items: [{ id: string, quantity: number }], email: string, couponCode?: string }`
  * **Response**: `{ sessionId: string, url: string }`

* **`GET /api/orders/:id`**
  * Retrieves shipping updates and receipt summaries for completed purchases.

---

## 2. Stripe Webhook Receivers
Endpoint: **`POST /api/webhooks/stripe`**

Verifies signatures using Vercel environment keys and dispatches event triggers:

```javascript
// Example webhook handling route
export async function POST(req) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // 1. Lock payment verification status in database
    await prisma.order.update({
      where: { paymentId: session.id },
      data: { status: "PROCESSING" }
    });
    // 2. Decrement variant stock parameters in DB
    // 3. Increment customer reward point accounts
    // 4. Trigger transactional emails (SendGrid / Resend)
  }

  return new Response("Success", { status: 200 });
}
```

---

## 3. Telemetry & Webhook Pings (PostHog, Hotjar, GA4)

Telemetry layers run both client-side (via Next.js/React hydration pings) and server-side (for privacy-safe tracking metrics).

* **Server-side tracking**: During transaction events (`checkout.session.completed`), the backend dispatches a POST request to PostHog and GA4 Measurement Protocol, guaranteeing tracking metrics are recorded even if user browsers block scripts.
* **GTM DataLayer dispatches**: Dispatches standard schema events like `view_item`, `add_to_cart`, and `purchase` for advertising matching.
