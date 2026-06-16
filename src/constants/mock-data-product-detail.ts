import { type ApiResponse } from './mock-data-home';

export interface ProductImage {
  image_id: number;
  image_url: string;
  is_thumbnail: boolean;
}

export interface ProductVariant {
  variant_id: number;
  price: number;
  stock_quantity: number;
  variant_attributes: {
    size: string;
    color: string;
  };
}

export interface ProductReview {
  review_id: number;
  full_name: string;
  rating: number;
  comment: string;
  created_at: string;
  review_images: string[];
}

export interface ProductDetailData {
  product: {
    product_id: number;
    product_name: string;
    product_description: string;
    product_tags: string[];
    images: ProductImage[];
    variants: ProductVariant[];
    reviews: ProductReview[];
  };
}

export const mockDataProductDetail: ApiResponse<ProductDetailData> = {
  status: 200,
  message: "Lấy chi tiết sản phẩm thành công",
  errorCode: null,
  data: {
    product: {
      product_id: 101,
      product_name: "Áo Polo Fred Perry M12 Vintage",
      product_description: "Dòng M12 huyền thoại của Fred Perry sản xuất tại Anh Quốc.",
      product_tags: ["vintage", "polo", "classic"],
      images: [
        {
          image_id: 1,
          image_url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820",
          is_thumbnail: true
        },
        {
          image_id: 2,
          image_url: "https://images.unsplash.com/photo-1574180566232-aaad1b5b8450",
          is_thumbnail: false
        }
      ],
      variants: [
        {
          variant_id: 501,
          price: 2500000.00,
          stock_quantity: 15,
          variant_attributes: { size: "M", color: "Đen/Viền Vàng" }
        },
        {
          variant_id: 502,
          price: 2500000.00,
          stock_quantity: 0,
          variant_attributes: { size: "L", color: "Đen/Viền Vàng" }
        }
      ],
      reviews: [
        {
          review_id: 10,
          full_name: "Nguyễn Văn A",
          rating: 5,
          comment: "Áo rất đẹp, chuẩn auth, chất vải mặc cực kỳ mát.",
          created_at: "2026-05-10T14:30:00Z",
          review_images: [
            "https://images.unsplash.com/photo-1503341455253-b2e723bb3db8"
          ]
        }
      ]
    }
  }
};