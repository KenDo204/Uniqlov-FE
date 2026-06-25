export interface CartItemRequest {
    variantId: number;
    quantity: number;
    note?: string; // Optional vì không có validation bắt buộc
}