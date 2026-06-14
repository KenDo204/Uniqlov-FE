import { useQuery } from '@tanstack/react-query';
import { axiosClient } from '../../apis/axiosClient';

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  title: string;
  verified: boolean;
  fit: 'Runs Small' | 'True to Size' | 'Runs Large';
}

export interface ProductVariant {
  id: string;
  colorName: string;
  colorCode: string; // Hex color code
  images: string[];
  sizes: {
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
    inventory: number;
  }[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'men' | 'women' | 'essentials' | 'active' | 'outerwear' | 'accessories';
  description: string;
  longDescription: string;
  features: string[];
  fabricDetails: string;
  shippingData: string;
  returnsData: string;
  rating: number;
  reviewsCount: number;
  reviews: Review[];
  variants: ProductVariant[];
  relatedProductIds: string[];
  tags: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isSeasonalEssential?: boolean;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Fallback static mock premium clothing products for UNILO
export const mockProducts: Product[] = [
  {
    id: 'cotton-tee',
    name: 'AirFlow Supima Cotton Crew Neck T-Shirt',
    price: 29000, // represent $29.00 or VND equivalent. Let's make it consistent. Since previous app used formatVND, let's use numbers that represent USD values, but we will format them as USD in the UNILO design! Or we can format as currency. Let's make them VND/USD compatible. Let's use 29.00 USD (or equivalent 650000 VND). Let's use 690000 VND (approx $29) so it fits formatVND perfectly.
    category: 'essentials',
    description: 'Engineered from 100% premium long-staple Supima cotton for exceptional softness, strength, and color retention.',
    longDescription: 'Our AirFlow Supima Cotton T-Shirt is a masterclass in everyday luxury. Crafted using long-staple cotton fibers that are twice as strong as standard cotton, it features a breathable knit structure that keeps you cool in summer and layered in winter. Designed with a perfect drape, it retains its fit and softness wash after wash.',
    features: [
      '100% Premium USA-Grown Supima Cotton',
      'Reinforced neck binding preventing stretch-out',
      'Ultra-soft touch with seamless side-seams',
      'Pre-shrunk fabric to maintain perfect silhouette'
    ],
    fabricDetails: 'Body: 100% Cotton. Rib: 97% Cotton, 3% Spandex. Machine wash cold, tumble dry low.',
    shippingData: 'Free standard shipping on orders over $75. Delivered in 3-5 business days.',
    returnsData: '30-day returns accepted. Items must be unworn and in original packaging with tags intact.',
    rating: 4.8,
    reviewsCount: 124,
    tags: ['Basic', 'Supima', 'Cotton', 'Tee', 'Everyday'],
    isBestSeller: true,
    isNewArrival: false,
    isSeasonalEssential: true,
    relatedProductIds: ['chino-pants', 'zip-hoodie', 'down-vest'],
    variants: [
      {
        id: 'var-tee-white',
        colorName: 'Off-White',
        colorCode: '#FAF9F6',
        images: [
          'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
          'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80'
        ],
        sizes: [
          { size: 'XS', inventory: 15 },
          { size: 'S', inventory: 22 },
          { size: 'M', inventory: 45 },
          { size: 'L', inventory: 30 },
          { size: 'XL', inventory: 12 },
          { size: 'XXL', inventory: 5 }
        ]
      },
      {
        id: 'var-tee-black',
        colorName: 'Ink Black',
        colorCode: '#1C1C1C',
        images: [
          'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80'
        ],
        sizes: [
          { size: 'XS', inventory: 8 },
          { size: 'S', inventory: 14 },
          { size: 'M', inventory: 32 },
          { size: 'L', inventory: 25 },
          { size: 'XL', inventory: 10 },
          { size: 'XXL', inventory: 0 } // Sold out
        ]
      },
      {
        id: 'var-tee-olive',
        colorName: 'Sage Olive',
        colorCode: '#556B2F',
        images: [
          'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&q=80'
        ],
        sizes: [
          { size: 'S', inventory: 10 },
          { size: 'M', inventory: 18 },
          { size: 'L', inventory: 15 }
        ]
      }
    ],
    reviews: [
      { id: 'r1', author: 'Sophia L.', rating: 5, date: '2026-05-12', comment: 'The best white tee I own. Heavyweight enough that it is not see-through, but breathable.', title: 'Outstanding Quality', verified: true, fit: 'True to Size' },
      { id: 'r2', author: 'Marcus V.', rating: 4, date: '2026-05-08', comment: 'Really soft material. Fits great around the shoulders, slightly long in length.', title: 'Very soft, premium drape', verified: true, fit: 'Runs Large' }
    ],
    seo: {
      title: 'AirFlow Supima Cotton T-Shirt | UNILO Essentials',
      description: 'Shop the premium UNILO AirFlow Supima Cotton T-Shirt. 100% long-staple cotton engineered for softness, comfort, and everyday longevity.',
      keywords: ['Supima cotton t-shirt', 'minimalist tee', 'premium basics', 'everyday clothing']
    }
  },
  {
    id: 'merino-sweater',
    name: '100% Fine Merino Wool Crew Neck Sweater',
    price: 1890000, // approx $79-89
    category: 'men',
    description: 'Knitted from ultra-fine Australian Merino wool. Naturally temperature regulating, soft, and machine washable.',
    longDescription: 'Crafted from 100% premium 19.5-micron fine Merino wool, this crew neck sweater delivers superior thermal insulation while remaining light and itch-free. Features anti-pill finish and elasticized rib-knit collar, cuffs, and hem. Elegant enough for offices, lightweight enough for layering.',
    features: [
      '100% Extra-fine Merino Wool (19.5 micron)',
      'Natural odor-resistant and moisture-wicking properties',
      'Advanced anti-pilling structure',
      'Machine washable convenience'
    ],
    fabricDetails: '100% Fine Merino Wool. Turn inside out, wash on wool cycle cold, lay flat to dry.',
    shippingData: 'Free shipping included on orders above $75.',
    returnsData: '30-day easy returns policy. Pre-paid label included.',
    rating: 4.9,
    reviewsCount: 88,
    tags: ['Wool', 'Merino', 'Sweater', 'Knitwear', 'Premium'],
    isBestSeller: true,
    isNewArrival: false,
    isSeasonalEssential: true,
    relatedProductIds: ['chino-pants', 'wool-coat'],
    variants: [
      {
        id: 'var-merino-charcoal',
        colorName: 'Charcoal Grey',
        colorCode: '#4A4A4A',
        images: [
          'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800&q=80',
          'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80'
        ],
        sizes: [
          { size: 'S', inventory: 12 },
          { size: 'M', inventory: 20 },
          { size: 'L', inventory: 18 },
          { size: 'XL', inventory: 8 }
        ]
      },
      {
        id: 'var-merino-navy',
        colorName: 'Classic Navy',
        colorCode: '#1B263B',
        images: [
          'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?w=800&q=80'
        ],
        sizes: [
          { size: 'S', inventory: 5 },
          { size: 'M', inventory: 15 },
          { size: 'L', inventory: 12 },
          { size: 'XL', inventory: 6 }
        ]
      }
    ],
    reviews: [
      { id: 'r3', author: 'David K.', rating: 5, date: '2026-04-30', comment: 'Extremely soft, not scratchy at all. Keeps me warm but does not make me sweat. Buying another color.', title: 'Perfection in a sweater', verified: true, fit: 'True to Size' }
    ],
    seo: {
      title: 'Fine Merino Wool Crew Neck Sweater | UNILO',
      description: 'Experience luxury Australian Merino wool. Machine-washable crew neck sweater for comfort and timeless style.',
      keywords: ['Merino wool sweater', 'fine knit sweater', 'minimalist knitwear', 'temperature regulating knit']
    }
  },
  {
    id: 'zip-hoodie',
    name: 'UltraStretch Dry-EX Full-Zip Hoodie',
    price: 1390000,
    category: 'active',
    description: 'High-performance athletic hoodie featuring multi-directional stretch and rapid dry technology.',
    longDescription: 'Engineered for both performance training and casual activewear, this hoodie is crafted using our proprietary Dry-EX knit. The fabric quickly absorbs and evaporates sweat, maintaining dry comfort. High stretch capability offers unrestricted movement.',
    features: [
      'Four-way active stretch formulation',
      'Advanced Dry-EX cooling technology',
      'Ergonomic hood styling with chin guard',
      'Concealed zip pockets for secure storage'
    ],
    fabricDetails: '78% Recycled Polyester, 22% Spandex. Machine wash cold with like colors, air dry.',
    shippingData: 'Free delivery eligible.',
    returnsData: 'Standard 30-day returns policy applies.',
    rating: 4.6,
    reviewsCount: 72,
    tags: ['Active', 'Athleisure', 'Hoodie', 'Stretch', 'Dry-EX'],
    isBestSeller: false,
    isNewArrival: true,
    isSeasonalEssential: false,
    relatedProductIds: ['ribbed-leggings', 'cotton-tee'],
    variants: [
      {
        id: 'var-hoodie-black',
        colorName: 'Active Black',
        colorCode: '#0D0D0D',
        images: [
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80'
        ],
        sizes: [
          { size: 'S', inventory: 8 },
          { size: 'M', inventory: 18 },
          { size: 'L', inventory: 22 },
          { size: 'XL', inventory: 14 }
        ]
      },
      {
        id: 'var-hoodie-grey',
        colorName: 'Heather Grey',
        colorCode: '#8E918F',
        images: [
          'https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?w=400&q=80'
        ],
        sizes: [
          { size: 'S', inventory: 10 },
          { size: 'M', inventory: 15 },
          { size: 'L', inventory: 10 }
        ]
      }
    ],
    reviews: [
      { id: 'r4', author: 'Liam N.', rating: 4, date: '2026-05-18', comment: 'Great for running in cool mornings. Sweat wicks away fast. Fits snugly, size up if you want it baggy.', title: 'Solid activewear hoodie', verified: true, fit: 'Runs Small' }
    ],
    seo: {
      title: 'UltraStretch Dry-EX Full-Zip Hoodie | UNILO Active',
      description: 'Performance athletic hoodie engineered with four-way stretch and Dry-EX moisture management.',
      keywords: ['Dry-EX hoodie', 'activewear zip hoodie', 'workout hoodie', 'stretch athletic jacket']
    }
  },
  {
    id: 'wool-coat',
    name: 'Hybrid Tech-Wool Single-Breasted Overcoat',
    price: 3890000,
    category: 'outerwear',
    description: 'Combining visual elegance of premium wool with synthetic core for lightweight warmth and water resistance.',
    longDescription: 'An architectural classic, our Hybrid Overcoat features a specialized weave blending fine sheep wool with hollow-core tech fibers. This offers the structured silhouette and thermal insulation of traditional heavy wool but at 30% lighter weight. Treated with water-repellent finish.',
    features: [
      'Premium wool blend with hollow-tech core',
      'Water-repellent barrier finish',
      'Fully lined with recycled polyester satin',
      'Interior breast pockets sized for modern tablets'
    ],
    fabricDetails: 'Shell: 65% Wool, 30% Polyester, 5% Cashmere. Lining: 100% Recycled Polyester. Dry clean only.',
    shippingData: 'Free express shipping on all coats.',
    returnsData: '30-day return policy. Outerwear items must have security tags attached.',
    rating: 4.9,
    reviewsCount: 41,
    tags: ['Coat', 'Wool', 'Cashmere', 'Outerwear', 'Tailored'],
    isBestSeller: true,
    isNewArrival: false,
    isSeasonalEssential: false,
    relatedProductIds: ['merino-sweater', 'chino-pants'],
    variants: [
      {
        id: 'var-coat-camel',
        colorName: 'Sand Camel',
        colorCode: '#C19A6B',
        images: [
          'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80',
          'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80'
        ],
        sizes: [
          { size: 'M', inventory: 8 },
          { size: 'L', inventory: 12 },
          { size: 'XL', inventory: 6 }
        ]
      },
      {
        id: 'var-coat-black',
        colorName: 'Obsidian Black',
        colorCode: '#121212',
        images: [
          'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80'
        ],
        sizes: [
          { size: 'S', inventory: 4 },
          { size: 'M', inventory: 10 },
          { size: 'L', inventory: 10 },
          { size: 'XL', inventory: 5 }
        ]
      }
    ],
    reviews: [
      { id: 'r5', author: 'Henry T.', rating: 5, date: '2026-03-24', comment: 'Magnificent coat. It sits perfectly. Feels warm yet surprisingly light when compared to my vintage coats.', title: 'Luxury style, lightweight feel', verified: true, fit: 'True to Size' }
    ],
    seo: {
      title: 'Hybrid Tech-Wool Single-Breasted Overcoat | UNILO',
      description: 'Elegant winter overcoat blending premium cash-wool with water-repellent tech cores. Lightweight insulation.',
      keywords: ['Wool overcoat', 'camel coat', 'single breasted coat', 'premium outerwear']
    }
  },
  {
    id: 'wide-trousers',
    name: 'Pleated Wide-Straight Drape Trousers',
    price: 1490000,
    category: 'women',
    description: 'Elegant flowing silhouette pants featuring front pleats, high rise, and clean drape lines.',
    longDescription: 'These pleated trousers utilize a specialty twill weave that maximizes fluid drape. Featuring double-front crisp pleats, a refined high-rise waistline, and wide straight-leg hem, they offer high level sophistication with comfort elasticized back waistband.',
    features: [
      'Fluid drape poly-rayon twill blend',
      'Crisp pressed front crease lines',
      'Flat front closure with elasticized back waist',
      'Anti-wrinkle easy-care technology'
    ],
    fabricDetails: '64% Polyester, 31% Rayon, 5% Spandex. Machine wash cold, hang dry.',
    shippingData: 'Free shipping eligible.',
    returnsData: '30-day standard return window.',
    rating: 4.7,
    reviewsCount: 95,
    tags: ['Trousers', 'Pants', 'Drape', 'Wide Leg', 'Office'],
    isBestSeller: true,
    isNewArrival: false,
    isSeasonalEssential: false,
    relatedProductIds: ['cotton-tee', 'flared-dress'],
    variants: [
      {
        id: 'var-trousers-cream',
        colorName: 'Alabaster Cream',
        colorCode: '#F5EFEB',
        images: [
          'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80',
          'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80'
        ],
        sizes: [
          { size: 'XS', inventory: 12 },
          { size: 'S', inventory: 20 },
          { size: 'M', inventory: 25 },
          { size: 'L', inventory: 15 }
        ]
      },
      {
        id: 'var-trousers-black',
        colorName: 'Midnight Black',
        colorCode: '#151515',
        images: [
          'https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=800&q=80'
        ],
        sizes: [
          { size: 'XS', inventory: 8 },
          { size: 'S', inventory: 18 },
          { size: 'M', inventory: 22 },
          { size: 'L', inventory: 12 }
        ]
      }
    ],
    reviews: [
      { id: 'r6', author: 'Elena R.', rating: 5, date: '2026-05-20', comment: 'The cut is gorgeous. They sit high and hide flat footwear perfectly. Fabric feels soft and flows when walking.', title: 'Insanely flattering', verified: true, fit: 'True to Size' }
    ],
    seo: {
      title: 'Pleated Wide-Straight Drape Trousers | UNILO Women',
      description: 'Shop elegant high-rise pleated pants featuring premium flowing drape, wide-leg cut, and anti-crease twill.',
      keywords: ['Pleated trousers', 'wide leg pants', 'high rise trousers', 'drape pants']
    }
  },
  {
    id: 'linen-shirt',
    name: 'Premium French Linen Stand Collar Shirt',
    price: 1190000,
    category: 'men',
    description: 'Sourced from Normandy flax fields. Breathable, breezy, and garment-washed for lived-in comfort.',
    longDescription: 'Perfect for warmer seasons, our Premium Linen Shirt uses 100% flax harvested in Northern France. The garment wash procedure softens the fibers, removing scratchiness. A minimalist band stand collar lends a modern artistic finish.',
    features: [
      '100% French Normandy Linen Flax',
      'Contemporary stand collar design',
      'Signature cross-stitch buttons',
      'Relaxed straight silhouette hem'
    ],
    fabricDetails: '100% Flax Linen. Machine wash warm, line dry in shade. Iron with steam if desired.',
    shippingData: 'Free shipping eligible.',
    returnsData: '30-day standard return window.',
    rating: 4.5,
    reviewsCount: 61,
    tags: ['Linen', 'Shirt', 'Summer', 'Flax', 'Breathable'],
    isBestSeller: false,
    isNewArrival: true,
    isSeasonalEssential: true,
    relatedProductIds: ['chino-pants', 'cotton-tee'],
    variants: [
      {
        id: 'var-linen-white',
        colorName: 'Pure Linen White',
        colorCode: '#FFFFFF',
        images: [
          'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80'
        ],
        sizes: [
          { size: 'S', inventory: 10 },
          { size: 'M', inventory: 22 },
          { size: 'L', inventory: 18 },
          { size: 'XL', inventory: 10 }
        ]
      },
      {
        id: 'var-linen-olive',
        colorName: 'Sage Green',
        colorCode: '#8F9779',
        images: [
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80'
        ],
        sizes: [
          { size: 'S', inventory: 6 },
          { size: 'M', inventory: 12 },
          { size: 'L', inventory: 14 }
        ]
      }
    ],
    reviews: [
      { id: 'r7', author: 'William B.', rating: 4, date: '2026-06-01', comment: 'Breathes beautifully during humid days. Wrinkles a bit but that is expected of real linen. Fits standard.', title: 'Excellent breezy summer shirt', verified: true, fit: 'True to Size' }
    ],
    seo: {
      title: 'French Linen Stand Collar Shirt | UNILO Men',
      description: 'Normandy linen flax stand collar shirts. Breezy, relaxed cuts engineered for breathability and summer layering.',
      keywords: ['French linen shirt', 'stand collar shirt', 'breathable linen shirt', 'men summer basics']
    }
  },
  {
    id: 'down-vest',
    name: 'Recycled Ultra Light Down Compact Vest',
    price: 1690000,
    category: 'outerwear',
    description: 'Filled with 750-fill power premium down. Compresses into integrated pocket bag. Shell made of recycled nylon.',
    longDescription: 'Our Ultra Light Down Vest offers modular heat preservation. Sourced with premium 750-fill down for high weight-to-warmth ratio. Finished with matte recycled nylon and durable water repellent (DWR) surface coating. Packs down inside an internal pocket pouch.',
    features: [
      '750-fill premium down filling',
      'Matte 100% recycled nylon shell',
      'DWR water-repellent coating',
      'Integrated pocket compression bag'
    ],
    fabricDetails: 'Shell: 100% Nylon. Filling: Down (minimum 90%). Hand wash cold, dry flat with clean tennis balls to fluff.',
    shippingData: 'Free shipping eligible.',
    returnsData: '30-day standard return window.',
    rating: 4.8,
    reviewsCount: 110,
    tags: ['Down', 'Vest', 'Layering', 'Warmth', 'Lightweight'],
    isBestSeller: true,
    isNewArrival: false,
    isSeasonalEssential: true,
    relatedProductIds: ['cotton-tee', 'merino-sweater'],
    variants: [
      {
        id: 'var-vest-black',
        colorName: 'Matte Black',
        colorCode: '#222222',
        images: [
          'https://images.unsplash.com/photo-1608063615781-e2ef8c13d114?w=800&q=80'
        ],
        sizes: [
          { size: 'S', inventory: 15 },
          { size: 'M', inventory: 25 },
          { size: 'L', inventory: 20 },
          { size: 'XL', inventory: 10 }
        ]
      },
      {
        id: 'var-vest-olive',
        colorName: 'Forest Khaki',
        colorCode: '#4B5320',
        images: [
          'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&q=80'
        ],
        sizes: [
          { size: 'S', inventory: 8 },
          { size: 'M', inventory: 15 },
          { size: 'L', inventory: 12 }
        ]
      }
    ],
    reviews: [
      { id: 'r8', author: 'Ethan P.', rating: 5, date: '2026-05-11', comment: 'Incredibly warm given how paper-thin it feels. I layer this under my trench coat. Packs down tiny.', title: 'Unbelievably warm and light', verified: true, fit: 'True to Size' }
    ],
    seo: {
      title: 'Ultra Light Down Compact Vest | UNILO Outerwear',
      description: 'Shop 750-fill-power packable down vests made with recycled nylon and water repellent coatings.',
      keywords: ['Ultra light down vest', 'packable down vest', 'layering down vest', 'minimalist outerwear']
    }
  },
  {
    id: 'ribbed-leggings',
    name: 'Seamless Active Ribbed High-Rise Leggings',
    price: 990000,
    category: 'active',
    description: 'Compressive moisture-wicking ribbed fabric. Elastic-free high-rise waist that holds and supports.',
    longDescription: 'High-waisted workout leggings featuring seamless construction. Made of breathable, micro-ribbed compression fabric that wicks moisture instantly. Flatlock seams prevent chafing while squats or stretching.',
    features: [
      'Four-way stretch ribbed knit formulation',
      'No-dig wide high-rise supportive waistband',
      'Chafe-free seamless circular-knit construction',
      '100% squat-proof dense knit guarantee'
    ],
    fabricDetails: '82% Nylon, 18% Elastane. Wash cold inside out, dry flat in shade.',
    shippingData: 'Free shipping eligible.',
    returnsData: '30-day standard return window.',
    rating: 4.7,
    reviewsCount: 142,
    tags: ['Active', 'Leggings', 'Ribbed', 'Seamless', 'Yoga'],
    isBestSeller: true,
    isNewArrival: false,
    isSeasonalEssential: false,
    relatedProductIds: ['zip-hoodie', 'cotton-tee'],
    variants: [
      {
        id: 'var-leggings-grey',
        colorName: 'Shadow Grey',
        colorCode: '#5C5E62',
        images: [
          'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&q=80',
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'
        ],
        sizes: [
          { size: 'XS', inventory: 15 },
          { size: 'S', inventory: 25 },
          { size: 'M', inventory: 30 },
          { size: 'L', inventory: 15 }
        ]
      },
      {
        id: 'var-leggings-olive',
        colorName: 'Sage Green',
        colorCode: '#6F7C6B',
        images: [
          'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80'
        ],
        sizes: [
          { size: 'XS', inventory: 5 },
          { size: 'S', inventory: 12 },
          { size: 'M', inventory: 20 },
          { size: 'L', inventory: 8 }
        ]
      }
    ],
    reviews: [
      { id: 'r9', author: 'Mia H.', rating: 5, date: '2026-06-03', comment: 'Completely squat proof. The ribbed material holds you in all the right places. Band doesnt roll down.', title: 'Outstanding active leggings', verified: true, fit: 'True to Size' }
    ],
    seo: {
      title: 'Seamless Active Ribbed Leggings | UNILO Active',
      description: 'High-waisted compression ribbed leggings. Seamless sweat-wicking squat-proof fabric for yoga, running, and fitness.',
      keywords: ['Ribbed leggings', 'seamless yoga pants', 'squat proof compression leggings', 'activewear women']
    }
  },
  {
    id: 'flared-dress',
    name: '3D Knit Cotton-Silk Flared Midi Dress',
    price: 1890000,
    category: 'women',
    description: 'Knitted continuously in three dimensions. Flowing flare structure without any side seams.',
    longDescription: 'Created using Japanese 3D WHOLEGARMENT knit engineering, this midi dress is knitted seamlessly in three dimensions. Drapes naturally and contours elegantly. Made from premium cotton blended with mulberry silk for subtle sheen and touch.',
    features: [
      'Seamless 3D whole-knit engineering',
      'Luxurious Cotton-Mulberry Silk blend',
      'Flared feminine A-line shape',
      'Stretch collar rib detail'
    ],
    fabricDetails: '70% Cotton, 20% Nylon, 10% Mulberry Silk. Hand wash cold, reshape, and dry flat.',
    shippingData: 'Free shipping eligible.',
    returnsData: '30-day standard return window.',
    rating: 4.8,
    reviewsCount: 52,
    tags: ['Dress', '3D Knit', 'Silk', 'Midi', 'Elegant'],
    isBestSeller: false,
    isNewArrival: true,
    isSeasonalEssential: false,
    relatedProductIds: ['wide-trousers', 'down-vest'],
    variants: [
      {
        id: 'var-dress-brick',
        colorName: 'Terracotta Brick',
        colorCode: '#B85D43',
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80'
        ],
        sizes: [
          { size: 'XS', inventory: 5 },
          { size: 'S', inventory: 15 },
          { size: 'M', inventory: 18 },
          { size: 'L', inventory: 10 }
        ]
      },
      {
        id: 'var-dress-black',
        colorName: 'Onyx Black',
        colorCode: '#1B1B1B',
        images: [
          'https://images.unsplash.com/photo-1612336307429-8a898d10e223?w=800&q=80'
        ],
        sizes: [
          { size: 'XS', inventory: 8 },
          { size: 'S', inventory: 20 },
          { size: 'M', inventory: 25 },
          { size: 'L', inventory: 12 }
        ]
      }
    ],
    reviews: [
      { id: 'r10', author: 'Natalie G.', rating: 5, date: '2026-05-29', comment: 'Zero seams makes this incredibly comfy. The drape is beautiful and swingy when I move. Very high-end feeling.', title: 'Elegant WholeGarment tech', verified: true, fit: 'True to Size' }
    ],
    seo: {
      title: '3D Knit Cotton-Silk Flared Midi Dress | UNILO Women',
      description: 'Seamless A-line midi dress engineered in 3D knit using premium cotton and mulberry silk fabrics.',
      keywords: ['3D knit dress', 'seamless midi dress', 'cotton silk dress', 'A-line knit dress']
    }
  },
  {
    id: 'chino-pants',
    name: 'Premium Comfort Slim-Fit Chino Pants',
    price: 1390000,
    category: 'men',
    description: 'Cotton twill with a touch of stretch. Wrinkle-resistant finish with premium satin lining inside waist.',
    longDescription: 'Timeless chino pants engineered for premium utility. Made of long-staple combed cotton twill with spandex fibers to allow comfort stretch. The fabric is treated with a light peachskin finish for peach-fuzz softness, and a mild wrinkle-resistant coating.',
    features: [
      'Premium combed cotton twill stretch fabric',
      'Signature tortoise shell contrast buttons',
      'Clean watch-pocket seam detail',
      'Comfort waistband lined with soft cotton satin'
    ],
    fabricDetails: '97% Cotton, 3% Spandex. Machine wash warm inside out with similar colors.',
    shippingData: 'Free shipping eligible.',
    returnsData: '30-day standard returns.',
    rating: 4.6,
    reviewsCount: 104,
    tags: ['Chino', 'Pants', 'Cotton', 'Workwear', 'Smart Casual'],
    isBestSeller: true,
    isNewArrival: false,
    isSeasonalEssential: false,
    relatedProductIds: ['cotton-tee', 'merino-sweater', 'linen-shirt'],
    variants: [
      {
        id: 'var-chino-khaki',
        colorName: 'Classic Khaki',
        colorCode: '#D2B48C',
        images: [
          'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
          'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=800&q=80'
        ],
        sizes: [
          { size: 'S', inventory: 15 },
          { size: 'M', inventory: 35 },
          { size: 'L', inventory: 30 },
          { size: 'XL', inventory: 15 }
        ]
      },
      {
        id: 'var-chino-olive',
        colorName: 'Moss Olive',
        colorCode: '#606E5C',
        images: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80'
        ],
        sizes: [
          { size: 'S', inventory: 10 },
          { size: 'M', inventory: 25 },
          { size: 'L', inventory: 20 },
          { size: 'XL', inventory: 8 }
        ]
      }
    ],
    reviews: [
      { id: 'r11', author: 'Robert M.', rating: 4, date: '2026-05-14', comment: 'Extremely soft chinos. They have a slight stretch that makes sitting at a desk all day actually comfortable.', title: 'Excellent fit and feel', verified: true, fit: 'True to Size' }
    ],
    seo: {
      title: 'Premium Comfort Slim Chinos | UNILO Men',
      description: 'Shop stretch cotton twill chinos. Wrinkle-resistant slim trousers built for business casual elegance.',
      keywords: ['Slim fit chinos', 'stretch chino pants', 'cotton twill trousers', 'business casual pants']
    }
  }
];

export function useFetchProducts(filters?: { category?: string; search?: string; tag?: string }) {
  return useQuery<Product[]>({
    queryKey: ['products', filters],
    queryFn: async () => {
      try {
        const response = await axiosClient.get<Product[]>('/products', { params: filters });
        return response.data;
      } catch {
        console.warn('API /products offline. Returning fallback mock products.');
        return mockProducts.filter((product) => {
          if (filters?.category && product.category !== filters.category) return false;
          if (filters?.search) {
            const query = filters.search.toLowerCase();
            const matchesName = product.name.toLowerCase().includes(query);
            const matchesDesc = product.description.toLowerCase().includes(query);
            const matchesTags = product.tags.some(t => t.toLowerCase().includes(query));
            if (!matchesName && !matchesDesc && !matchesTags) return false;
          }
          if (filters?.tag && !product.tags.includes(filters.tag)) return false;
          return true;
        });
      }
    },
  });
}
