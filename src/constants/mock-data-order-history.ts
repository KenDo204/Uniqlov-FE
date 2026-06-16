import { type ApiResponse } from './mock-data-home';

export interface FinancialSummary {
  total_product_money: number;
  shop_discount_amount: number;
  original_shipping_fee: number;
  shipping_discount_amount: number;
  payment_discount_amount: number;
  final_payment_money: number;
}

export interface OrderDetail {
  order_detail_id: number;
  product_name: string;
  variant_attributes: {
    size: string;
    color: string;
  };
  num_of_product: number;
  order_detail_price: number;
  thumbnail_url: string;
}

export interface Order {
  order_id: number;
  order_date: string;
  order_status: "PENDING" | "PAID" | "SHIPPING" | "COMPLETED" | "CANCELLED";
  payment_method: number;
  delivery_status: string;
  tracking_number: string;
  financial_summary: FinancialSummary;
  order_details: OrderDetail[];
}

export interface OrderHistoryData {
  orders: Order[];
}

export const mockDataOrderHistory: ApiResponse<OrderHistoryData> = {
  status: 200,
  message: "Lấy lịch sử mua hàng thành công",
  errorCode: null,
  data: {
    orders: [
      {
        order_id: 8801,
        order_date: "2026-06-14",
        order_status: "SHIPPING",
        payment_method: 1,
        delivery_status: "ON_GOING",
        tracking_number: "GHN-8801-ABC",
        financial_summary: {
          total_product_money: 2500000.00,
          shop_discount_amount: 100000.00,
          original_shipping_fee: 35000.00,
          shipping_discount_amount: 35000.00,
          payment_discount_amount: 0.00,
          final_payment_money: 2400000.00
        },
        order_details: [
          {
            order_detail_id: 1,
            product_name: "Áo Polo Fred Perry M12 Vintage",
            variant_attributes: { size: "M", color: "Đen/Viền Vàng" },
            num_of_product: 1,
            order_detail_price: 2500000.00,
            thumbnail_url: "https://images.unsplash.com/photo-1581655353564-df123a1eb820"
          }
        ]
      },
      {
        order_id: 8755,
        order_date: "2026-05-20",
        order_status: "COMPLETED",
        payment_method: 0,
        delivery_status: "COMPLETED",
        tracking_number: "AHA-8755-XYZ",
        financial_summary: {
          total_product_money: 650000.00,
          shop_discount_amount: 0.00,
          original_shipping_fee: 20000.00,
          shipping_discount_amount: 0.00,
          payment_discount_amount: 0.00,
          final_payment_money: 670000.00
        },
        order_details: [
          {
            order_detail_id: 2,
            product_name: "Áo Sơ Mi Nam Tay Ngắn Họa Tiết",
            variant_attributes: { size: "L", color: "Trắng" },
            num_of_product: 1,
            order_detail_price: 650000.00,
            thumbnail_url: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10"
          }
        ]
      }
    ]
  }
};