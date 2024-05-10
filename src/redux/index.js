import { configureStore } from '@reduxjs/toolkit';
import productHomeNewSlice from './slices/products/productHomeNewSlice';
import productHomeSuggestedSlice from './slices/products/productHomeSuggestedSlice';
import productRecommendSlice from './slices/products/productRecommendSlice';
import searchPageSlice from './slices/searchs/searchPageSlice';
import globalSlice from './slices/globals/globalSlice';
import authSlice, { loadUser } from './slices/auth/authSlice';

const store = configureStore({
   reducer: {
      global: globalSlice,
      productHomeNew: productHomeNewSlice,
      productHomeSuggested: productHomeSuggestedSlice,
      productRecommend: productRecommendSlice,
      searchPage: searchPageSlice,
      auth: authSlice,
   },
});

store.dispatch(loadUser());

export default store;
