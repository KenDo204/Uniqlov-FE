import type { ProductResponse } from '@/types/product';
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
export type Review = ProductReview;

// Helper to strip outer double quotes from backend strings
const cleanStr = (s?: string): string => {
  if (!s) return '';
  // Strip starting/ending quotes if present (e.g. "\"ao-thun-basic-cotton-unisex\"" -> "ao-thun-basic-cotton-unisex")
  return s.replace(/^"|"$/g, '');
};

const colorNameToHex: Record<string, string> = {
  'trắng': '#FFFFFF',
  'đỏ': '#C53030',
  'đen': '#000000',
  'xám': '#8E8E93',
  'navy': '#1B344C',
  'xanh navy': '#1B344C',
  'beige': '#E1D5C2',
  'be': '#E8D8C8',
  'xanh nhạt': '#A5C9EB',
  'xanh đậm': '#1A365D',
  'kem': '#F4EAE1',
  'xanh army': '#4A5D4E',
  'xanh rêu': '#4A5D4E',
  'nâu': '#6B4F35',
  'camel': '#C19A6B',
  'hồng': '#E2A4A4',
};

export const getColorCode = (colorName: string): string => {
  const normalized = colorName.trim().toLowerCase();
  return colorNameToHex[normalized] || '#8E8E93';
};

export const mapProductResponseToProduct = (res: ProductResponse): Product => {
  // Resolve sizes arrays from optionsConfig
  const sizes: string[] = res.optionsConfig?.sizes || [];
  
  // Resolve colors as objects containing colorName and colorCode
  const rawColors: any = res.optionsConfig?.colors || [];
  const colors: Array<{ colorName: string; colorCode: string }> = Array.isArray(rawColors)
    ? rawColors.map((c: any) => {
        if (typeof c === 'string') {
          const name = cleanStr(c);
          return {
            colorName: name,
            colorCode: getColorCode(name)
          };
        }
        const name = cleanStr(c.colorName || c.name || '');
        return {
          colorName: name,
          colorCode: c.colorCode || getColorCode(name)
        };
      })
    : [];

  return {
    product_id: res.productId,
    product_slug: cleanStr(res.productSlug),
    product_name: cleanStr(res.productName),
    category_id: String(res.categoryId),
    product_description: cleanStr(res.productDescription),
    product_tags: (res.productTags || []).map((t) => cleanStr(t)),
    in_popular: res.inPopular || false,
    in_stock: res.inStock || false,
    target_gender: res.targetGender,
    max_order_quantity: res.maxOrderQuantity || 5,
    options_config: {
      sizes: sizes.map((s) => cleanStr(s)),
      colors
    },
    weight_kg: res.weightKg || 0,
    length_m: res.lengthM || 0,
    width_m: res.widthM || 0,
    height_m: res.heightM || 0,
    search_vector: null,
    images: (res.images || []).map((img): ProductImage => ({
      image_id: img.imageId,
      image_url: img.imageUrl,
      is_thumbnail: img.isThumbnail || false,
      display_order: img.displayOrder || 0
    })),
    variants: (res.variants || []).map((v): ProductVariant => {
      // Map attributes keys that might be in Vietnamese (kich_co, mau_sac)
      const colorName = cleanStr(
        v.variantAttributes?.mau_sac ||
        v.variantAttributes?.colorName ||
        v.variantAttributes?.ColorName ||
        v.variantAttributes?.color ||
        ''
      );
      const size = cleanStr(
        v.variantAttributes?.kich_co ||
        v.variantAttributes?.size ||
        v.variantAttributes?.Size ||
        ''
      );
      
      // Look up color code from optionsConfig colors list to populate colorCode
      const matchedColor = colors.find(
        (c) => c.colorName.toLowerCase() === colorName.toLowerCase()
      );
      const colorCode = matchedColor?.colorCode || v.variantAttributes?.colorCode || getColorCode(colorName);

      return {
        variant_id: v.variantId,
        sku_code: cleanStr(v.skuCode),
        price: v.price,
        cost_price: v.costPrice,
        stock_quantity: v.stockQuantity,
        locked_stock: v.lockedStock || 0,
        variant_image: v.variantImage === 'null' || !v.variantImage ? null : v.variantImage,
        variant_attributes: {
          size,
          colorName,
          colorCode
        }
      };
    }),
    reviews: []
  };
};

