export interface OrderDetail {
  order_detail_id: number;
  variant_id: number;
  product_name: string; // Kéo từ product sang cho dễ làm FE
  variant_attributes: any;
  num_of_product: number;
  order_detail_price: number;
  total_money: number;
  item_status: string;
}

export interface Order {
  order_id: number;
  order_date: string;
  order_status: 'PENDING' | 'PAID' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
  payment_method: number; // 0: COD, 1: VNPAY, 2: MOMO
  shipping_method: number;
  delivery_status: string;
  tracking_number: string;
  
  // Dòng tiền 3 tầng
  total_product_money: number;
  shop_discount_amount: number;
  original_shipping_fee: number;
  shipping_discount_amount: number;
  payment_discount_amount: number;
  final_payment_money: number;

  order_details: OrderDetail[];
}

export const mockOrders: Order[] = [
  {
    order_id: 5548,
    order_date: '2026-06-10',
    order_status: 'SHIPPING',
    payment_method: 1,
    shipping_method: 0,
    delivery_status: 'ON_GOING',
    tracking_number: 'EM-5548-GHN',
    
    total_product_money: 690000,
    shop_discount_amount: 50000,
    original_shipping_fee: 30000,
    shipping_discount_amount: 30000,
    payment_discount_amount: 0,
    final_payment_money: 640000,
    
    order_details: [
      {
        order_detail_id: 8950,
        variant_id: 1001,
        product_name: 'AirFlow Supima Cotton Crew Neck T-Shirt',
        variant_attributes: { size: 'S', colorName: 'Off-White' },
        num_of_product: 1,
        order_detail_price: 690000,
        total_money: 690000,
        item_status: 'NORMAL'
      }
    ]
  }
];