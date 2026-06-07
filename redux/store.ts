import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import storeReducer from './slices/storeSlice';
import orderReducer from './slices/orderSlice';
import customerReducer from './slices/customerSlice';
import financeReducer from './slices/financeSlice';
import profileReducer from './slices/profileSlice';
import exploreReducer from './slices/exploreSlice'
import notificationReducer from './slices/notificationSlice';
import favoriteReducer  from './slices/favoriteSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    store: storeReducer,
    order: orderReducer,
    customer: customerReducer,
    finance: financeReducer,
    profile: profileReducer,
    explore: exploreReducer,
    notifications: notificationReducer,
    favorites: favoriteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

