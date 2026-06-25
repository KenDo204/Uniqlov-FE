import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '@/services/orderService';
import type { CheckoutResponse, OrderResponse, OrderSummaryResponse } from '@/types/order/responses';
import type { CheckoutRequest, OrderCancelRequest, OrderStatusUpdateRequest } from '@/types/order/requests';
import type { PageResponse } from '@/types/common/apiResponse';

interface OrderState {
  ordersList: PageResponse<OrderSummaryResponse> | null;
  currentOrderDetail: OrderResponse | null;
  checkoutResult: CheckoutResponse | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: OrderState = {
  ordersList: null,
  currentOrderDetail: null,
  checkoutResult: null,
  isFetching: false,
  isSubmitting: false,
  error: null,
};

// --- ASYNC THUNKS ---

export const checkoutThunk = createAsyncThunk(
  'order/checkout',
  async (payload: CheckoutRequest, { rejectWithValue }) => {
    try {
      const response = await orderService.checkout(payload);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tiến hành đặt hàng');
    }
  }
);

export const fetchMyOrdersThunk = createAsyncThunk(
  'order/fetchMyOrders',
  async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
    try {
      const response = await orderService.getMyOrders(page, size);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy lịch sử mua hàng');
    }
  }
);

export const fetchMyOrderDetailThunk = createAsyncThunk(
  'order/fetchMyOrderDetail',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await orderService.getMyOrderDetail(orderId);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy chi tiết đơn hàng');
    }
  }
);

export const cancelMyOrderThunk = createAsyncThunk(
  'order/cancelMyOrder',
  async ({ orderId, data }: { orderId: number; data: OrderCancelRequest }, { rejectWithValue }) => {
    try {
      await orderService.cancelMyOrder(orderId, data);
      return orderId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể hủy đơn hàng');
    }
  }
);

// ADMIN ASYNC THUNKS

export const fetchAllOrdersThunk = createAsyncThunk(
  'order/fetchAllOrders',
  async ({ page, size }: { page: number; size: number }, { rejectWithValue }) => {
    try {
      const response = await orderService.getAllOrders(page, size);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy danh sách đơn hàng');
    }
  }
);

export const fetchOrderDetailThunk = createAsyncThunk(
  'order/fetchOrderDetail',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderDetail(orderId);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể lấy chi tiết đơn hàng');
    }
  }
);

export const updateOrderStatusThunk = createAsyncThunk(
  'order/updateStatus',
  async ({ orderId, data }: { orderId: number; data: OrderStatusUpdateRequest }, { rejectWithValue }) => {
    try {
      await orderService.updateOrderStatus(orderId, data);
      return { orderId, status: data.newStatus };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearCheckoutResult: (state) => {
      state.checkoutResult = null;
    },
    clearOrderDetail: (state) => {
      state.currentOrderDetail = null;
    }
  },
  extraReducers: (builder) => {
    // checkoutThunk
    builder
      .addCase(checkoutThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.checkoutResult = null;
      })
      .addCase(checkoutThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.checkoutResult = action.payload || null;
      })
      .addCase(checkoutThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // fetchMyOrdersThunk
    builder
      .addCase(fetchMyOrdersThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.ordersList = action.payload || null;
      })
      .addCase(fetchMyOrdersThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // fetchMyOrderDetailThunk
    builder
      .addCase(fetchMyOrderDetailThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchMyOrderDetailThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.currentOrderDetail = action.payload || null;
      })
      .addCase(fetchMyOrderDetailThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // cancelMyOrderThunk
    builder
      .addCase(cancelMyOrderThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(cancelMyOrderThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const cancelledOrderId = action.payload;
        if (state.ordersList) {
          state.ordersList.content = state.ordersList.content.map(o =>
            o.orderId === cancelledOrderId ? { ...o, orderStatus: 'CANCELLED' } : o
          );
        }
        if (state.currentOrderDetail && state.currentOrderDetail.orderId === cancelledOrderId) {
          state.currentOrderDetail.orderStatus = 'CANCELLED';
        }
      })
      .addCase(cancelMyOrderThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });

    // fetchAllOrdersThunk
    builder
      .addCase(fetchAllOrdersThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchAllOrdersThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.ordersList = action.payload || null;
      })
      .addCase(fetchAllOrdersThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // fetchOrderDetailThunk
    builder
      .addCase(fetchOrderDetailThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchOrderDetailThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        state.currentOrderDetail = action.payload || null;
      })
      .addCase(fetchOrderDetailThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      });

    // updateOrderStatusThunk
    builder
      .addCase(updateOrderStatusThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const { orderId, status } = action.payload;
        if (state.ordersList) {
          state.ordersList.content = state.ordersList.content.map(o =>
            o.orderId === orderId ? { ...o, orderStatus: status } : o
          );
        }
        if (state.currentOrderDetail && state.currentOrderDetail.orderId === orderId) {
          state.currentOrderDetail.orderStatus = status;
        }
      })
      .addCase(updateOrderStatusThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrderError, clearCheckoutResult, clearOrderDetail } = orderSlice.actions;
export default orderSlice.reducer;
