import { type ApiResponse } from './mock-data-home';

export interface CartItem {
  cart_item_id: number;
  variant_id: number;
  product_name: string;
  variant_attributes: {
    size: string;
    color: string;
  };
  quantity: number;
  unit_price: number;
  total_money: number;
  thumbnail_url: string;
}

export interface Address {
  address_id: number;
  recipient_name: string;
  phone: string;
  full_address: string;
  is_default: boolean;
}

export interface Coupon {
  coupon_id: number;
  code: string;
  coupon_type: "SHOP_VOUCHER" | "FREE_SHIPPING" | "PAYMENT_VOUCHER";
  description: string;
  discount_amount: number;
}

export interface CartCheckoutData {
  cart_items: CartItem[];
  addresses: Address[];
  available_coupons: Coupon[];
}

export const mockDataCartCheckout: ApiResponse<CartCheckoutData> = {
  status: 200,
  message: "Lấy thông tin giỏ hàng và thanh toán thành công",
  errorCode: null,
  data: {
    cart_items: [
      {
        cart_item_id: 1,
        variant_id: 501,
        product_name: "Áo Polo Fred Perry M12 Vintage",
        variant_attributes: { size: "M", color: "Đen/Viền Vàng" },
        quantity: 1,
        unit_price: 2500000.00,
        total_money: 2500000.00,
        thumbnail_url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820"
      }
    ],
    addresses: [
      {
        address_id: 201,
        recipient_name: "Đỗ Tiến Anh Khôi",
        phone: "0901234567",
        full_address: "Số 123, Đường Nguyễn Văn Cừ, Phường 2, Quận 5, TP. Hồ Chí Minh",
        is_default: true
      }
    ],
    available_coupons: [
      {
        coupon_id: 1,
        code: "EASYMALL_WELCOME",
        coupon_type: "SHOP_VOUCHER",
        description: "Giảm 100k cho đơn hàng từ 2 triệu đồng",
        discount_amount: 100000.00
      },
      {
        coupon_id: 2,
        code: "FREESHIP_XTRA",
        coupon_type: "FREE_SHIPPING",
        description: "Miễn phí vận chuyển toàn quốc",
        discount_amount: 35000.00
      },
      {
        coupon_id: 3,
        code: "MOMO_PAY",
        coupon_type: "PAYMENT_VOUCHER",
        description: "Giảm 5% tối đa 50k khi thanh toán qua MoMo",
        discount_amount: 50000.00
      }
    ]
  }
};