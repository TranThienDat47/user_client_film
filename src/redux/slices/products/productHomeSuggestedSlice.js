import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ProductServices from '~/services/ProductServices';

const LENGTH_PAGE_SUGGESTED = 14;
const initialState = {
   suggestedProducts: [],
   pageSuggestedProducts: -1,
   hasMore: false,
   loadingMore: false,
   error: null,
   status: '',
};

export const fetchHomeSuggested = createAsyncThunk(
   'productHomeSuggested/fetchHomeSuggested',
   async (page, { rejectWithValue }) => {
      try {
         const response = await ProductServices.search({
            skip: page * LENGTH_PAGE_SUGGESTED,
            limit: LENGTH_PAGE_SUGGESTED,
         });

         if (response.success) {
            if (response.products.length >= LENGTH_PAGE_SUGGESTED) {
               return {
                  suggestedProducts: response.products,
                  hasMore: true,
                  pageSuggestedProducts: page,
               };
            } else if (
               response.products.length > 0 &&
               response.products.length < LENGTH_PAGE_SUGGESTED
            ) {
               return {
                  suggestedProducts: response.products,
                  hasMore: false,
                  pageSuggestedProducts: page,
               };
            } else if (response.products.length <= 0) {
               return {
                  suggestedProducts: response.products,
                  hasMore: false,
                  pageSuggestedProducts: page - 1,
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

const productHomeSuggestedSlice = createSlice({
   name: 'productHomeSuggested',
   initialState,
   reducers: {
      beforeLoadHomeSuggested: (state, action) => {
         state.hasMore = true;
         state.loadingMore = true;
      },
   },
   extraReducers(builder) {
      builder
         .addCase(fetchHomeSuggested.pending, (state, action) => {
            state.status = 'loading';
            state.loadingMore = true;
            state.hasMore = true;
         })
         .addCase(fetchHomeSuggested.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.loadingMore = false;
            state.hasMore = action.payload.hasMore;
            state.suggestedProducts = [
               ...state.suggestedProducts,
               ...action.payload.suggestedProducts,
            ];
            state.pageSuggestedProducts = action.payload.pageSuggestedProducts;
         })
         .addCase(fetchHomeSuggested.rejected, (state, action) => {
            state.status = 'failed';
            state.loadingMore = false;
            state.hasMore = false;
            state.error = action.payload.error;
         });
   },
});

export const { beforeLoadHomeSuggested } = productHomeSuggestedSlice.actions;

export default productHomeSuggestedSlice.reducer;
