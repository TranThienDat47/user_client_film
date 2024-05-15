import { configureStore } from '@reduxjs/toolkit';
import globalSlice from './slices/globals/globalSlice';
import authSlice, { loadUser } from './slices/auth/authSlice';
import searchPageSlice from './slices/searchs/searchPageSlice';
import productHomeNewSlice from './slices/products/productHomeNewSlice';
import productRecommendSlice from './slices/products/productRecommendSlice';
import productHomeSuggestedSlice from './slices/products/productHomeSuggestedSlice';

const store = configureStore({
   reducer: {
      auth: authSlice,
      global: globalSlice,
      searchPage: searchPageSlice,
      productHomeNew: productHomeNewSlice,
      productRecommend: productRecommendSlice,
      productHomeSuggested: productHomeSuggestedSlice,
   },
});

store.dispatch(loadUser());

export default store;
