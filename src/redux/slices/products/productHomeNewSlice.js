import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ProductServices from '~/services/ProductServices';

const LENGTH_PAGE_SUGGESTED = 14;

export const fetchHomeNew = createAsyncThunk('productHomeNew/fetchHomeNew', async () => {
   const response = await ProductServices.search({
      skip: 0,
      limit: LENGTH_PAGE_SUGGESTED,
      recently: true,
   });

   return response.products;
});

const productHomeNewSlice = createSlice({
   name: 'productHomenew',
   initialState: {
      newProducts: [],
      loading: true,
      error: null,
      status: '',
   },
   reducers: {},
   extraReducers(builder) {
      builder
         .addCase(fetchHomeNew.pending, (state, action) => {
            state.status = 'loading';
            state.loading = true;
         })
         .addCase(fetchHomeNew.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.newProducts = action.payload;
            state.loading = false;
         })
         .addCase(fetchHomeNew.rejected, (state, action) => {
            state.status = 'failed';
            state.loading = false;
            state.error = action.error.message;
         });
   },
});

export default productHomeNewSlice.reducer;
