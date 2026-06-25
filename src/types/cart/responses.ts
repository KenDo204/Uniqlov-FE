export interface CartItemResponse {
    cartItemId: number;
    variantId: number;
    productName: string;
    variantAttributes: string;
    variantImage: string;
    price: number;
    quantity: number;
    totalMoney: number;
    note?: string;
    available: boolean;
    unavailableReason: string | null;
}

export interface CartResponse {
    cartId: number;
    totalAmount: number;
    items: CartItemResponse[];
}