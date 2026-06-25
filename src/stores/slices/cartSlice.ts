import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { cartService } from '@/services/cartService';
import type { CartItemResponse } from '@/types/cart/responses';
import type { CartItemRequest } from '@/types/cart/requests';

export interface CartItem {
  id: string; // For guest: variantId or slug-attribute combination. For DB: stringified variantId.
  name: string;
  price: number;
  image?: string;
  color?: string;
  size?: string;
  quantity: number;
  // DB cart fields
  cartItemId?: number;
  variantId?: number;
  totalMoney?: number;
  note?: string;
  available?: boolean;
  unavailableReason?: string | null;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  isLoading: boolean;
  error: string | null;
}

// Helpers to parse backend variantAttributes to color and size
const parseAttributes = (variantAttributes: string) => {
  let color = undefined;
  let size = undefined;
  try {
    const attrs = JSON.parse(variantAttributes);
    color = attrs.color || attrs.colorName || attrs.màu_sắc || attrs.màu;
    size = attrs.size || attrs.kích_cỡ || attrs.kích_thước;
  } catch (e) {
    // Fallback regex parsing if attributes is plain string like "Màu sắc: Đỏ, Kích cỡ: M"
    const colorMatch = variantAttributes.match(/(?:Màu sắc|Màu|Color):\s*([^,;]+)/i);
    const sizeMatch = variantAttributes.match(/(?:Kích cỡ|Kích thước|Size):\s*([^,;]+)/i);
    if (colorMatch) color = colorMatch[1].trim();
    if (sizeMatch) size = sizeMatch[1].trim();
  }
  return { color, size };
};

const mapDbItemToLocal = (dbItem: CartItemResponse): CartItem => {
  const { color, size } = parseAttributes(dbItem.variantAttributes);
  return {
    id: `${dbItem.variantId}`,
    name: dbItem.productName,
    price: dbItem.price,
    image: dbItem.variantImage,
    color,
    size,
    quantity: dbItem.quantity,
    cartItemId: dbItem.cartItemId,
    variantId: dbItem.variantId,
    totalMoney: dbItem.totalMoney,
    note: dbItem.note,
    available: dbItem.available,
    unavailableReason: dbItem.unavailableReason
  };
};

const getInitialCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('cart-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed?.state?.items)) {
          return parsed.state.items;
        }
      }
    } catch (e) {
      console.error('Error parsing stored cart', e);
    }
  }
  return [];
};

const persistCart = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart-storage', JSON.stringify({ state: { items } }));
  }
};

const initialState: CartState = {
  items: getInitialCart(),
  totalAmount: 0,
  isLoading: false,
  error: null,
};

// --- ASYNC THUNKS FOR DATABASE CART ---

export const fetchCartDbThunk = createAsyncThunk(
  'cart/fetchDb',
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartService.getCart();
      return response.result; // CartResponse
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy dữ liệu giỏ hàng');
    }
  }
);

export const addItemDbThunk = createAsyncThunk(
  'cart/addDb',
  async (payload: CartItemRequest, { rejectWithValue }) => {
    try {
      const response = await cartService.addItem(payload);
      return response.result; // CartResponse
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể thêm vào giỏ hàng');
    }
  }
);

export const updateItemDbThunk = createAsyncThunk(
  'cart/updateDb',
  async ({ variantId, quantity, note }: { variantId: number; quantity: number; note?: string }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateItem(variantId, { variantId, quantity, note });
      return response.result; // CartResponse
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật giỏ hàng');
    }
  }
);

export const removeItemDbThunk = createAsyncThunk(
  'cart/removeDb',
  async (variantId: number, { rejectWithValue }) => {
    try {
      await cartService.removeItem(variantId);
      return variantId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa sản phẩm khỏi giỏ hàng');
    }
  }
);

export const clearCartDbThunk = createAsyncThunk(
  'cart/clearDb',
  async (_, { rejectWithValue }) => {
    try {
      await cartService.clearCart();
      return true;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể xóa sạch giỏ hàng');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // LOCAL/GUEST REDUCERS
    addItem(state, action: PayloadAction<{ item: Omit<CartItem, 'quantity'>; quantity?: number }>) {
      const { item, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ ...item, quantity });
      }
      persistCart(state.items);
      state.totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      persistCart(state.items);
      state.totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = Math.max(1, quantity);
      }
      persistCart(state.items);
      state.totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    },
    clearCart(state) {
      state.items = [];
      persistCart(state.items);
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    // fetchCartDbThunk
    builder
      .addCase(fetchCartDbThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartDbThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.items = action.payload.items.map(mapDbItemToLocal);
          state.totalAmount = action.payload.totalAmount;
        }
      })
      .addCase(fetchCartDbThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // addItemDbThunk
    builder
      .addCase(addItemDbThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addItemDbThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.items = action.payload.items.map(mapDbItemToLocal);
          state.totalAmount = action.payload.totalAmount;
        }
      })
      .addCase(addItemDbThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // updateItemDbThunk
    builder
      .addCase(updateItemDbThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateItemDbThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.items = action.payload.items.map(mapDbItemToLocal);
          state.totalAmount = action.payload.totalAmount;
        }
      })
      .addCase(updateItemDbThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // removeItemDbThunk
    builder
      .addCase(removeItemDbThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(removeItemDbThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const removedVariantId = action.payload;
        state.items = state.items.filter(i => i.variantId !== removedVariantId && i.id !== `${removedVariantId}`);
        state.totalAmount = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      })
      .addCase(removeItemDbThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // clearCartDbThunk
    builder
      .addCase(clearCartDbThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(clearCartDbThunk.fulfilled, (state) => {
        state.isLoading = false;
        state.items = [];
        state.totalAmount = 0;
      })
      .addCase(clearCartDbThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
