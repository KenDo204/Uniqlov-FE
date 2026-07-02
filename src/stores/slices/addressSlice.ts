import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addressService } from '@/services/addressService';
import type { AddressResponse, CreateAddressRequest, UpdateAddressRequest } from '@/types/address';
import axios from 'axios';

interface AddressState {
  addresses: AddressResponse[];
  defaultAddress: AddressResponse | null;
  isFetching: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: AddressState = {
  addresses: [],
  defaultAddress: null,
  isFetching: false,
  isSubmitting: false,
  error: null,
};

export const fetchAddressesThunk = createAsyncThunk(
  'address/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await addressService.getMyAddresses();
      return response.result;
    } catch (error) {
      let message = 'Lỗi tải danh sách địa chỉ';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const createAddressThunk = createAsyncThunk(
  'address/createAddress',
  async (payload: CreateAddressRequest, { rejectWithValue }) => {
    try {
      const response = await addressService.createAddress(payload);
      return response.result;
    } catch (error) {
      let message = 'Thêm địa chỉ thất bại';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const updateAddressThunk = createAsyncThunk(
  'address/updateAddress',
  async ({ id, data }: { id: number; data: UpdateAddressRequest }, { rejectWithValue }) => {
    try {
      const response = await addressService.updateAddress(id, data);
      return response.result;
    } catch (error) {
      let message = 'Cập nhật địa chỉ thất bại';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const deleteAddressThunk = createAsyncThunk(
  'address/deleteAddress',
  async (id: number, { rejectWithValue }) => {
    try {
      await addressService.deleteAddress(id);
      return id;
    } catch (error) {
      let message = 'Xóa địa chỉ thất bại';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

export const setDefaultAddressThunk = createAsyncThunk(
  'address/setDefaultAddress',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await addressService.setDefault(id);
      return response.result;
    } catch (error) {
      let message = 'Đặt địa chỉ mặc định thất bại';
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      return rejectWithValue(message);
    }
  }
);

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    clearAddressError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Addresses
      .addCase(fetchAddressesThunk.pending, (state) => {
        state.isFetching = true;
        state.error = null;
      })
      .addCase(fetchAddressesThunk.fulfilled, (state, action) => {
        state.isFetching = false;
        if (action.payload) {
          state.addresses = action.payload;
          state.defaultAddress = action.payload.find((addr) => addr.isDefault) || null;
        }
      })
      .addCase(fetchAddressesThunk.rejected, (state, action) => {
        state.isFetching = false;
        state.error = action.payload as string;
      })
      // Create Address
      .addCase(createAddressThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createAddressThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload) {
          if (action.payload.isDefault) {
            state.addresses = state.addresses.map((addr) => ({
              ...addr,
              isDefault: false,
            }));
            state.defaultAddress = action.payload;
          }
          state.addresses.push(action.payload);
        }
      })
      .addCase(createAddressThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // Update Address
      .addCase(updateAddressThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateAddressThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload) {
          const updated = action.payload;
          if (updated.isDefault) {
            state.addresses = state.addresses.map((addr) => ({
              ...addr,
              isDefault: addr.addressId === updated.addressId ? true : false,
            }));
            state.defaultAddress = updated;
          } else {
            const index = state.addresses.findIndex((addr) => addr.addressId === updated.addressId);
            if (index !== -1) {
              state.addresses[index] = updated;
            }
          }
        }
      })
      .addCase(updateAddressThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // Delete Address
      .addCase(deleteAddressThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(deleteAddressThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const deletedId = action.payload;
        state.addresses = state.addresses.filter((addr) => addr.addressId !== deletedId);
        if (state.defaultAddress?.addressId === deletedId) {
          state.defaultAddress = null;
        }
      })
      .addCase(deleteAddressThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      // Set Default Address
      .addCase(setDefaultAddressThunk.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(setDefaultAddressThunk.fulfilled, (state, action) => {
        state.isSubmitting = false;
        if (action.payload) {
          const defaultAddr = action.payload;
          state.addresses = state.addresses.map((addr) => ({
            ...addr,
            isDefault: addr.addressId === defaultAddr.addressId,
          }));
          state.defaultAddress = defaultAddr;
        }
      })
      .addCase(setDefaultAddressThunk.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
