import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import themeReducer from './themeSlice';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import roleReducer from './slices/roleSlice';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import permissionReducer from './slices/permissionSlice';
import couponReducer from './slices/couponSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    role: roleReducer,
    permission: permissionReducer,
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
    coupon: couponReducer,
    order: orderReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
