import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ProductServices from '~/services/ProductServices';

const LENGTH_PAGE_SEARCH = 9;

const initialState = {
   searchResultProducts: [],
   pageSearchResultProducts: -1,
   keySearch: '',
   tempSelectSearchResult: '',
   hasMore: false,
   loadingMore: false,
   error: null,
   status: '',
};

export const fetchSearchResultProducts = createAsyncThunk(
   'searchPage/fetchSearchResultProducts',
   async (page, { rejectWithValue, getState }) => {
      const keySearch = getState().searchPage.keySearch;
      try {
         const response = await ProductServices.search({
            skip: page * LENGTH_PAGE_SEARCH,
            limit: LENGTH_PAGE_SEARCH,
            key: keySearch,
         });

         if (response.success) {
            if (response.products.length >= LENGTH_PAGE_SEARCH) {
               return {
                  searchResultProducts: response.products,
                  hasMore: true,
                  pageSearchResultProducts: page,
               };
            } else if (
               response.products.length > 0 &&
               response.products.length < LENGTH_PAGE_SEARCH
            ) {
               return {
                  searchResultProducts: response.products,
                  hasMore: false,
                  pageSearchResultProducts: page,
               };
            } else if (response.products.length <= 0) {
               return {
                  searchResultProducts: response.products,
                  hasMore: false,
                  pageSearchResultProducts: page - 1,
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

const searchPageSlice = createSlice({
   name: 'productRecommend',
   initialState,
   reducers: {
      beforeLoadSearchResult: (state, action) => {
         state.hasMore = true;
         state.loadingMore = true;
      },
      resetSearchResult: (state, action) => {
         state.searchResultProducts = [];
         state.pageSearchResultProducts = -1;
      },
      setKeySearchResult: (state, action) => {
         state.keySearch = action.payload;
      },
      setTempSelectSearchResult: (state, action) => {
         state.tempSelectSearchResult = action.payload;
      },
   },
   extraReducers(builder) {
      builder
         .addCase(fetchSearchResultProducts.pending, (state, action) => {
            state.status = 'loading';
            state.loadingMore = true;
            state.hasMore = true;
         })
         .addCase(fetchSearchResultProducts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.loadingMore = false;
            state.hasMore = action.payload.hasMore;
            state.searchResultProducts = [
               ...state.searchResultProducts,
               ...action.payload.searchResultProducts,
            ];
            state.pageSearchResultProducts = action.payload.pageSearchResultProducts;
         })
         .addCase(fetchSearchResultProducts.rejected, (state, action) => {
            state.status = 'failed';
            state.loadingMore = false;
            state.hasMore = false;
            state.error = action.payload.error;
         });
   },
});

export const {
   resetSearchResult,
   setKeySearchResult,
   beforeLoadSearchResult,
   setTempSelectSearchResult,
} = searchPageSlice.actions;

export default searchPageSlice.reducer;
