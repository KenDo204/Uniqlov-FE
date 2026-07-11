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
import wishlistReducer from './slices/wishlistSlice';
import reviewReducer from './slices/reviewSlice';
import addressReducer from './slices/addressSlice';
import ghnReducer from './slices/ghnSlice';
import sliderReducer from './slices/sliderSlice';
import contactReducer from './slices/contactSlice';

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
    wishlist: wishlistReducer,
    review: reviewReducer,
    address: addressReducer,
    ghn: ghnReducer,
    slider: sliderReducer,
    contact: contactReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
