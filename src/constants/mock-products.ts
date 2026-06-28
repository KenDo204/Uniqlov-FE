import { Gender } from '@/types/enums/genderType';

export interface ProductImage {
  image_id: number;
  image_url: string;
  is_thumbnail: boolean;
  display_order: number;
}

export interface ProductVariant {
  variant_id: number;
  sku_code: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  locked_stock: number;
  variant_image: string | null;
  variant_attributes: {
    size: string;
    colorName: string;
    colorCode: string;
  };
}

export interface ProductReview {
  review_id: string | number;
  full_name: string;
  rating: number;
  comment: string;
  created_at: string;
  review_status: 'APPROVED' | 'PENDING' | 'HIDDEN';
  review_images: string[];
}

export interface Product {
  product_id: number;
  product_slug: string;
  product_name: string;
  category_id: string; 
  product_description: string;
  product_tags: string[];
  in_popular: boolean;
  in_stock: boolean;

  target_gender: Gender; 
  max_order_quantity: number; 
  
  options_config: {
    sizes: string[];
    colors: Array<{
      colorName: string;
      colorCode: string;
    }>;
  }; 
  
  weight_kg: number;
  length_m: number;
  width_m: number;
  height_m: number;
  search_vector: string | null;

  images: ProductImage[];
  variants: ProductVariant[];
  reviews: ProductReview[];
}

export const mockProducts: Product[] = [
  {
    product_id: 1,
    product_slug: 'cotton-tee',
    product_name: 'AirFlow Supima Cotton Crew Neck T-Shirt',
    category_id: 'essentials',
    product_description: 'Engineered from 100% premium long-staple Supima cotton for exceptional softness, strength, and color retention.',
    product_tags: ['Basic', 'Supima', 'Cotton', 'Tee', 'Everyday'],
    in_popular: true,
    in_stock: true,
    target_gender: Gender.OTHER,
    max_order_quantity: 5, 
    options_config: {
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      colors: [
        { colorName: "Off-White", colorCode: "#FAF9F6" },
        { colorName: "Ink Black", colorCode: "#1C1C1C" },
        { colorName: "Sage Olive", colorCode: "#556B2F" }
      ]
    },
    weight_kg: 0.30, 
    length_m: 0.20,  
    width_m: 0.15,   
    height_m: 0.03,  
    search_vector: null, 
    images: [
      { image_id: 11, image_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80', is_thumbnail: true, display_order: 1 },
      { image_id: 12, image_url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80', is_thumbnail: false, display_order: 2 },
      { image_id: 13, image_url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80', is_thumbnail: false, display_order: 3 }
    ],
    variants: [
      { variant_id: 101, sku_code: 'TEE-WHT-XS', price: 690000, cost_price: 250000, stock_quantity: 15, locked_stock: 0, variant_image: null, variant_attributes: { size: 'XS', colorName: 'Off-White', colorCode: '#FAF9F6' } },
      { variant_id: 102, sku_code: 'TEE-WHT-S', price: 690000, cost_price: 250000, stock_quantity: 22, locked_stock: 0, variant_image: null, variant_attributes: { size: 'S', colorName: 'Off-White', colorCode: '#FAF9F6' } },
      { variant_id: 103, sku_code: 'TEE-WHT-M', price: 690000, cost_price: 250000, stock_quantity: 45, locked_stock: 0, variant_image: null, variant_attributes: { size: 'M', colorName: 'Off-White', colorCode: '#FAF9F6' } },
      { variant_id: 104, sku_code: 'TEE-WHT-L', price: 690000, cost_price: 250000, stock_quantity: 30, locked_stock: 0, variant_image: null, variant_attributes: { size: 'L', colorName: 'Off-White', colorCode: '#FAF9F6' } },
      { variant_id: 105, sku_code: 'TEE-BLK-M', price: 690000, cost_price: 250000, stock_quantity: 32, locked_stock: 0, variant_image: null, variant_attributes: { size: 'M', colorName: 'Ink Black', colorCode: '#1C1C1C' } },
      { variant_id: 106, sku_code: 'TEE-OLV-L', price: 690000, cost_price: 250000, stock_quantity: 18, locked_stock: 0, variant_image: null, variant_attributes: { size: 'L', colorName: 'Sage Olive', colorCode: '#556B2F' } }
    ],
    reviews: [
      { review_id: 'r1', full_name: 'Sophia L.', rating: 5, created_at: '2026-05-12T00:00:00Z', comment: 'The best white tee I own.', review_status: 'APPROVED', review_images: [
          "https://images.unsplash.com/photo-1503341455253-b2e723bb3db8"
        ] }
    ]
  },
  {
    product_id: 2,
    product_slug: 'merino-sweater',
    product_name: '100% Fine Merino Wool Crew Neck Sweater',
    category_id: 'men',
    product_description: 'Knitted from ultra-fine Australian Merino wool. Naturally temperature regulating, soft, and machine washable.',
    product_tags: ['Wool', 'Merino', 'Sweater', 'Knitwear', 'Premium'],
    in_popular: true,
    in_stock: true,
    target_gender: Gender.MALE,
    max_order_quantity: 4,
    options_config: {
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { colorName: "Charcoal Grey", colorCode: "#4A4A4A" },
        { colorName: "Classic Navy", colorCode: "#1B263B" }
      ]
    },
    weight_kg: 0.40,
    length_m: 0.25,
    width_m: 0.20,
    height_m: 0.05,
    search_vector: null,
    images: [
      { image_id: 21, image_url: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?w=800&q=80', is_thumbnail: true, display_order: 1 },
      { image_id: 22, image_url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80', is_thumbnail: false, display_order: 2 }
    ],
    variants: [
      { variant_id: 201, sku_code: 'MER-GRY-M', price: 1890000, cost_price: 700000, stock_quantity: 20, locked_stock: 0, variant_image: null, variant_attributes: { size: 'M', colorName: 'Charcoal Grey', colorCode: '#4A4A4A' } },
      { variant_id: 202, sku_code: 'MER-NVY-L', price: 1890000, cost_price: 700000, stock_quantity: 12, locked_stock: 0, variant_image: null, variant_attributes: { size: 'L', colorName: 'Classic Navy', colorCode: '#1B263B' } }
    ],
    reviews: [
      { review_id: 'r3', full_name: 'David K.', rating: 5, created_at: '2026-04-30T00:00:00Z', comment: 'Extremely soft, not scratchy at all.', review_status: 'APPROVED', review_images: [
          "https://images.unsplash.com/photo-1503341455253-b2e723bb3db8"
        ] }
    ]
  },
  {
    product_id: 3,
    product_slug: 'zip-hoodie',
    product_name: 'UltraStretch Dry-EX Full-Zip Hoodie',
    category_id: 'active',
    product_description: 'High-performance athletic hoodie featuring multi-directional stretch and rapid dry technology.',
    product_tags: ['Active', 'Athleisure', 'Hoodie', 'Stretch', 'Dry-EX'],
    in_popular: false,
    in_stock: true,
    target_gender: Gender.OTHER,
    max_order_quantity: 5,
    options_config: {
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { colorName: "Active Black", colorCode: "#0D0D0D" },
        { colorName: "Heather Grey", colorCode: "#8E918F" }
      ]
    },
    weight_kg: 0.50,
    length_m: 0.30,
    width_m: 0.22,
    height_m: 0.06,
    search_vector: null,
    images: [
      { image_id: 31, image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80', is_thumbnail: true, display_order: 1 }
    ],
    variants: [
      { variant_id: 301, sku_code: 'ZIP-BLK-M', price: 1390000, cost_price: 500000, stock_quantity: 18, locked_stock: 0, variant_image: null, variant_attributes: { size: 'M', colorName: 'Active Black', colorCode: '#0D0D0D' } },
      { variant_id: 302, sku_code: 'ZIP-GRY-L', price: 1390000, cost_price: 500000, stock_quantity: 10, locked_stock: 0, variant_image: null, variant_attributes: { size: 'L', colorName: 'Heather Grey', colorCode: '#8E918F' } }
    ],
    reviews: [
      {
        review_id: 10,
        full_name: "Nguyễn Văn A",
        rating: 5,
        comment: "Áo rất đẹp, chuẩn auth, chất vải mặc cực kỳ mát.",
        created_at: '2026-05-12T00:00:00Z',
        review_status: 'APPROVED',
        review_images: [
          "https://images.unsplash.com/photo-1503341455253-b2e723bb3db8"
        ]
      }
    ]
  },
  {
    product_id: 4,
    product_slug: 'wool-coat',
    product_name: 'Hybrid Tech-Wool Single-Breasted Overcoat',
    category_id: 'outerwear',
    product_description: 'Combining visual elegance of premium wool with synthetic core for lightweight warmth and water resistance.',
    product_tags: ['Coat', 'Wool', 'Cashmere', 'Outerwear', 'Tailored'],
    in_popular: true,
    in_stock: true,
    target_gender: Gender.OTHER,
    max_order_quantity: 2,
    options_config: {
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { colorName: "Sand Camel", colorCode: "#C19A6B" },
        { colorName: "Obsidian Black", colorCode: "#121212" }
      ]
    },
    weight_kg: 1.20,
    length_m: 0.50,
    width_m: 0.40,
    height_m: 0.10,
    search_vector: null,
    images: [
      { image_id: 41, image_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80', is_thumbnail: true, display_order: 1 }
    ],
    variants: [
      { variant_id: 401, sku_code: 'COT-CAM-M', price: 3890000, cost_price: 1500000, stock_quantity: 8, locked_stock: 0, variant_image: null, variant_attributes: { size: 'M', colorName: 'Sand Camel', colorCode: '#C19A6B' } },
      { variant_id: 402, sku_code: 'COT-BLK-L', price: 3890000, cost_price: 1500000, stock_quantity: 10, locked_stock: 0, variant_image: null, variant_attributes: { size: 'L', colorName: 'Obsidian Black', colorCode: '#121212' } }
    ],
    reviews: []
  },
  {
    product_id: 5,
    product_slug: 'wide-trousers',
    product_name: 'Pleated Wide-Straight Drape Trousers',
    category_id: 'women',
    product_description: 'Elegant flowing silhouette pants featuring front pleats, high rise, and clean drape lines.',
    product_tags: ['Trousers', 'Pants', 'Drape', 'Wide Leg', 'Office'],
    in_popular: true,
    in_stock: true,
    target_gender: Gender.FEMALE,
    max_order_quantity: 4,
    options_config: {
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { colorName: "Alabaster Cream", colorCode: "#F5EFEB" },
        { colorName: "Midnight Black", colorCode: "#151515" }
      ]
    },
    weight_kg: 0.45,
    length_m: 0.35,
    width_m: 0.25,
    height_m: 0.04,
    search_vector: null,
    images: [
      { image_id: 51, image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80', is_thumbnail: true, display_order: 1 }
    ],
    variants: [
      { variant_id: 501, sku_code: 'TRO-CRM-S', price: 1490000, cost_price: 600000, stock_quantity: 20, locked_stock: 0, variant_image: null, variant_attributes: { size: 'S', colorName: 'Alabaster Cream', colorCode: '#F5EFEB' } },
      { variant_id: 502, sku_code: 'TRO-BLK-M', price: 1490000, cost_price: 600000, stock_quantity: 22, locked_stock: 0, variant_image: null, variant_attributes: { size: 'M', colorName: 'Midnight Black', colorCode: '#151515' } }
    ],
    reviews: []
  },
  {
    product_id: 6,
    product_slug: 'linen-shirt',
    product_name: 'Premium French Linen Stand Collar Shirt',
    category_id: 'men',
    product_description: 'Sourced from Normandy flax fields. Breathable, breezy, and garment-washed for lived-in comfort.',
    product_tags: ['Linen', 'Shirt', 'Summer', 'Flax', 'Breathable'],
    in_popular: false,
    in_stock: true,
    target_gender: Gender.MALE,
    max_order_quantity: 5,
    options_config: {
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { colorName: "Pure Linen White", colorCode: "#FFFFFF" },
        { colorName: "Sage Green", colorCode: "#8F9779" }
      ]
    },
    weight_kg: 0.35,
    length_m: 0.22,
    width_m: 0.18,
    height_m: 0.03,
    search_vector: null,
    images: [
      { image_id: 61, image_url: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80', is_thumbnail: true, display_order: 1 }
    ],
    variants: [
      { variant_id: 601, sku_code: 'LIN-WHT-M', price: 1190000, cost_price: 450000, stock_quantity: 22, locked_stock: 0, variant_image: null, variant_attributes: { size: 'M', colorName: 'Pure Linen White', colorCode: '#FFFFFF' } },
      { variant_id: 602, sku_code: 'LIN-GRN-L', price: 1190000, cost_price: 450000, stock_quantity: 14, locked_stock: 0, variant_image: null, variant_attributes: { size: 'L', colorName: 'Sage Green', colorCode: '#8F9779' } }
    ],
    reviews: []
  },
  {
    product_id: 7,
    product_slug: 'down-vest',
    product_name: 'Recycled Ultra Light Down Compact Vest',
    category_id: 'outerwear',
    product_description: 'Filled with 750-fill power premium down. Compresses into integrated pocket bag. Shell made of recycled nylon.',
    product_tags: ['Down', 'Vest', 'Layering', 'Warmth', 'Lightweight'],
    in_popular: true,
    in_stock: true,
    target_gender: Gender.OTHER,
    max_order_quantity: 3,
    options_config: {
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { colorName: "Matte Black", colorCode: "#222222" },
        { colorName: "Forest Khaki", colorCode: "#4B5320" }
      ]
    },
    weight_kg: 0.35,
    length_m: 0.25,
    width_m: 0.20,
    height_m: 0.05,
    search_vector: null,
    images: [
      { image_id: 71, image_url: 'https://images.unsplash.com/photo-1608063615781-e2ef8c13d114?w=800&q=80', is_thumbnail: true, display_order: 1 }
    ],
    variants: [
      { variant_id: 701, sku_code: 'VES-BLK-M', price: 1690000, cost_price: 650000, stock_quantity: 25, locked_stock: 0, variant_image: null, variant_attributes: { size: 'M', colorName: 'Matte Black', colorCode: '#222222' } },
      { variant_id: 702, sku_code: 'VES-KHK-L', price: 1690000, cost_price: 650000, stock_quantity: 12, locked_stock: 0, variant_image: null, variant_attributes: { size: 'L', colorName: 'Forest Khaki', colorCode: '#4B5320' } }
    ],
    reviews: []
  },
  {
    product_id: 8,
    product_slug: 'ribbed-leggings',
    product_name: 'Seamless Active Ribbed High-Rise Leggings',
    category_id: 'active',
    product_description: 'Compressive moisture-wicking ribbed fabric. Elastic-free high-rise waist that holds and supports.',
    product_tags: ['Active', 'Leggings', 'Ribbed', 'Seamless', 'Yoga'],
    in_popular: true,
    in_stock: true,
    target_gender: Gender.FEMALE, // Nữ
    max_order_quantity: 5, 
    options_config: {
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { colorName: "Shadow Grey", colorCode: "#5C5E62" },
        { colorName: "Sage Green", colorCode: "#6F7C6B" }
      ]
    },
    weight_kg: 0.25, 
    length_m: 0.25,  
    width_m: 0.18,   
    height_m: 0.05,  
    search_vector: null,
    images: [
      { image_id: 81, image_url: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&q=80', is_thumbnail: true, display_order: 1 }
    ],
    variants: [
      { variant_id: 801, sku_code: 'LEG-GRY-XS', price: 990000, cost_price: 350000, stock_quantity: 15, locked_stock: 0, variant_image: null, variant_attributes: { size: 'XS', colorName: 'Shadow Grey', colorCode: '#5C5E62' } },
      { variant_id: 802, sku_code: 'LEG-GRN-S', price: 990000, cost_price: 350000, stock_quantity: 12, locked_stock: 0, variant_image: null, variant_attributes: { size: 'S', colorName: 'Sage Green', colorCode: '#6F7C6B' } }
    ],
    reviews: []
  },
  {
    product_id: 9,
    product_slug: 'flared-dress',
    product_name: '3D Knit Cotton-Silk Flared Midi Dress',
    category_id: 'women',
    product_description: 'Knitted continuously in three dimensions. Flowing flare structure without any side seams.',
    product_tags: ['Dress', '3D Knit', 'Silk', 'Midi', 'Elegant'],
    in_popular: false,
    in_stock: true,
    target_gender: Gender.FEMALE,
    max_order_quantity: 3,
    options_config: {
      sizes: ["XS", "S", "M", "L"],
      colors: [
        { colorName: "Terracotta Brick", colorCode: "#B85D43" },
        { colorName: "Onyx Black", colorCode: "#1B1B1B" }
      ]
    },
    weight_kg: 0.60,
    length_m: 0.35,
    width_m: 0.28,
    height_m: 0.05,
    search_vector: null,
    images: [
      { image_id: 91, image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', is_thumbnail: true, display_order: 1 }
    ],
    variants: [
      { variant_id: 901, sku_code: 'DRS-BRK-S', price: 1890000, cost_price: 800000, stock_quantity: 15, locked_stock: 0, variant_image: null, variant_attributes: { size: 'S', colorName: 'Terracotta Brick', colorCode: '#B85D43' } },
      { variant_id: 902, sku_code: 'DRS-BLK-M', price: 1890000, cost_price: 800000, stock_quantity: 25, locked_stock: 0, variant_image: null, variant_attributes: { size: 'M', colorName: 'Onyx Black', colorCode: '#1B1B1B' } }
    ],
    reviews: []
  },
  {
    product_id: 10,
    product_slug: 'chino-pants',
    product_name: 'Premium Comfort Slim-Fit Chino Pants',
    category_id: 'men',
    product_description: 'Cotton twill with a touch of stretch. Wrinkle-resistant finish with premium satin lining inside waist.',
    product_tags: ['Chino', 'Pants', 'Cotton', 'Workwear', 'Smart Casual'],
    in_popular: true,
    in_stock: true,
    target_gender: Gender.MALE,
    max_order_quantity: 4,
    options_config: {
      sizes: ["S", "M", "L", "XL"],
      colors: [
        { colorName: "Classic Khaki", colorCode: "#D2B48C" },
        { colorName: "Moss Olive", colorCode: "#606E5C" }
      ]
    },
    weight_kg: 0.50,
    length_m: 0.30,
    width_m: 0.20,
    height_m: 0.04,
    search_vector: null,
    images: [
      { image_id: 1001, image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80', is_thumbnail: true, display_order: 1 }
    ],
    variants: [
      { variant_id: 10001, sku_code: 'CHI-KHK-M', price: 1390000, cost_price: 500000, stock_quantity: 35, locked_stock: 0, variant_image: null, variant_attributes: { size: 'M', colorName: 'Classic Khaki', colorCode: '#D2B48C' } },
      { variant_id: 10002, sku_code: 'CHI-OLV-L', price: 1390000, cost_price: 500000, stock_quantity: 20, locked_stock: 0, variant_image: null, variant_attributes: { size: 'L', colorName: 'Moss Olive', colorCode: '#606E5C' } }
    ],
    reviews: []
  }
];