import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ProductServices from '~/services/ProductServices';

const initialState = {
   productCurrent: {
      product: {},
      product_details: [],
   },

   loading: true,
   status: '',
};

export const fetchProductCurrent = createAsyncThunk(
   'global/fetchProductCurrent',
   async (_id, { rejectWithValue }) => {
      try {
         const response = await ProductServices.show({ product_id: _id });

         if (response.success)
            return {
               product: response.products,
               product_details: response.productDetails,
            };
      } catch (err) {
         return rejectWithValue({
            error: err.message,
         });
      }
   },
);

const globalSlice = createSlice({
   name: 'global',
   initialState,
   reducers: {},
   extraReducers(builder) {
      builder
         .addCase(fetchProductCurrent.pending, (state, action) => {
            state.status = 'loading';
            state.loading = true;
         })
         .addCase(fetchProductCurrent.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.productCurrent = action.payload;
            state.loading = false;
         })
         .addCase(fetchProductCurrent.rejected, (state, action) => {
            state.status = 'failed';
            state.loading = false;
            state.error = action.payload.error;
         });
   },
});

// export const {} = globalSlice.actions;

export default globalSlice.reducer;
