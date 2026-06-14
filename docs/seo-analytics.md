# UNILO SEO & Analytics Specifications

This document outlines structural schema declarations (Schema.org), sitemap schemas, and Google Tag Manager (GTM) layouts to optimize index rankings and purchase tracking.

---

## 1. Schema.org JSON-LD Declarations

Inject corresponding JSON-LD script blocks into the HTML headers of relevant pages to ensure Google Rich Snippets render ratings, prices, and FAQs correctly.

### Product Schema (PDP)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "AirFlow Supima Cotton Crew Neck T-Shirt",
  "image": [
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80"
  ],
  "description": "Engineered from 100% premium long-staple Supima cotton.",
  "sku": "cotton-tee-white-m",
  "mpn": "UNILO-TEE-100",
  "brand": {
    "@type": "Brand",
    "name": "UNILO"
  },
  "review": {
    "@type": "Review",
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5"
    },
    "author": {
      "@type": "Person",
      "name": "Sophia L."
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "124"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://UNILO.com/product/cotton-tee",
    "priceCurrency": "USD",
    "price": "29.00",
    "priceValidUntil": "2027-01-01",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "UNILO"
    }
  }
}
</script>
```

### FAQ Schema (Help Center / FAQ accordion)
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "How long does standard shipping take?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Standard shipping inside the US and Europe takes 3-5 business days."
    }
  }]
}
</script>
```

---

## 2. Google Tag Manager DataLayer Dispatches

Standardized tracking variables are triggered client-side when users interact with purchase pipelines:

### Add to Cart Event
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'add_to_cart',
  ecommerce: {
    currency: 'USD',
    value: 29.00,
    items: [{
      item_id: 'cotton-tee',
      item_name: 'AirFlow Supima Cotton Crew Neck T-Shirt',
      item_brand: 'UNILO',
      item_category: 'essentials',
      price: 29.00,
      quantity: 1,
      item_variant: 'Off-White / M'
    }]
  }
});
```

### Purchase Event
```javascript
window.dataLayer.push({
  event: 'purchase',
  ecommerce: {
    transaction_id: 'ORD-7429',
    value: 29.00,
    tax: 0.00,
    shipping: 0.00,
    currency: 'USD',
    coupon: 'WELCOME',
    items: [{
      item_id: 'cotton-tee',
      item_name: 'AirFlow Supima Cotton Crew Neck T-Shirt',
      item_brand: 'UNILO',
      price: 29.00,
      quantity: 1
    }]
  }
});
```

---

## 3. SEO Sitemap & Robots.txt Layouts

### XML Sitemap format (`sitemap.xml`)
We index clean static collection directories, products slug pages, about narratives, and journal blogs.
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://UNILO.com/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://UNILO.com/men</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://UNILO.com/product/cotton-tee</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

### Robots.txt configurations (`robots.txt`)
```txt
User-agent: *
Allow: /
Disallow: /checkout
Disallow: /cart
Disallow: /account
Disallow: /api/

Sitemap: https://UNILO.com/sitemap.xml
```
