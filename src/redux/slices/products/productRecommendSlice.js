import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ProductServices from '~/services/ProductServices';

const LENGTH_PAGE_RECOMMEND = 7;

const initialState = {
   recommendProducts: [],
   pageRecommendProducts: -1,
   hasMore: false,
   loadingMore: false,
   error: null,
   status: '',
};

export const fetchRecommendProducts = createAsyncThunk(
   'productRecommend/fetchRecommendProducts',
   async (page, { rejectWithValue }) => {
      try {
         const response = await ProductServices.searchRecommend({
            skip: page * LENGTH_PAGE_RECOMMEND,
            limit: LENGTH_PAGE_RECOMMEND,
         });

         if (response.success) {
            if (response.products?.length >= LENGTH_PAGE_RECOMMEND) {
               return {
                  recommendProducts: response.products,
                  hasMore: true,
                  pageRecommendProducts: page,
               };
            } else if (
               response.products?.length > 0 &&
               response.products.length < LENGTH_PAGE_RECOMMEND
            ) {
               return {
                  recommendProducts: response.products,
                  hasMore: false,
                  pageRecommendProducts: page,
               };
            } else if (response.products.length <= 0) {
               return {
                  recommendProducts: response.products,
                  hasMore: false,
                  pageRecommendProducts: page - 1,
               };
            }
         } else {
            return rejectWithValue({
               hasMore: false,
               error: response?.message,
            });
         }
      } catch (err) {
         return rejectWithValue({
            hasMore: false,
            error: err.message,
         });
      }
   },
);

const productRecommendSlice = createSlice({
   name: 'productRecommend',
   initialState,
   reducers: {
      beforeLoadProductRecommend: (state, action) => {
         state.hasMore = true;
         state.loadingMore = true;
      },
   },
   extraReducers(builder) {
      builder
         .addCase(fetchRecommendProducts.pending, (state, action) => {
            state.status = 'loading';
            state.loadingMore = true;
            state.hasMore = true;
         })
         .addCase(fetchRecommendProducts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.loadingMore = false;
            state.hasMore = action.payload.hasMore;
            state.recommendProducts = [
               ...state.recommendProducts,
               ...action.payload.recommendProducts,
            ];
            state.pageRecommendProducts = action.payload.pageRecommendProducts;
         })
         .addCase(fetchRecommendProducts.rejected, (state, action) => {
            state.status = 'failed';
            state.loadingMore = false;
            state.hasMore = false;
            state.error = action.payload.error;
         });
   },
});

export const { beforeLoadProductRecommend } = productRecommendSlice.actions;

export default productRecommendSlice.reducer;
