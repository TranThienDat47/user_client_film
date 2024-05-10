import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthServices from '~/services/AuthServices';
import FollowService from '~/services/FollowService';

const LENGTH_PAGE_FOLLOW = 9;

const initialState = {
   isAuthenticated: false,
   isVerify: false,
   user: null,
   authLoading: true,
   follow: {
      followProduct: [],
      keySearchFromPageFollow: '',
      sortFromPageFollow: 1,
      hasMore: false,
      pageFollowProduct: -1,
      loadingMore: false,
      error: null,
   },
};

export const loadUser = createAsyncThunk('auth/loadUser', async () => {
   const response = await AuthServices.authorization();

   if (response && response.success) {
      if (response.is_verify) {
         return {
            isAuthenticated: true,
            isVerify: true,
            user: response.user,
         };
      } else {
         return {
            isAuthenticated: true,
            isVerify: false,
            user: response.user,
         };
      }
   } else {
      return {
         isAuthenticated: false,
         isVerify: false,
         user: null,
      };
   }
});

export const fetchFollowProducts = createAsyncThunk(
   'auth/fetchFollowProducts',
   async (page, { getState, rejectWithValue }) => {
      const state = getState().auth;
      const { _id: user_id } = state.user;
      const { follow } = state;

      try {
         const response = await FollowService.getListFollow({
            skip: page * LENGTH_PAGE_FOLLOW,
            limit: LENGTH_PAGE_FOLLOW,
            user_id,
            keySearch: follow.keySearchFromPageFollow,
            sort: follow.sortFromPageFollow,
         });

         if (response.success) {
            if (response.follows.length >= LENGTH_PAGE_FOLLOW) {
               return {
                  followProduct: response.follows,
                  hasMore: true,
                  pageFollowProduct: page,
               };
            } else if (
               response.follows.length > 0 &&
               response.follows.length < LENGTH_PAGE_FOLLOW
            ) {
               return {
                  followProduct: response.follows,
                  hasMore: false,
                  pageFollowProduct: page,
               };
            } else if (response.follows.length <= 0) {
               return {
                  followProduct: response.follows,
                  hasMore: false,
                  pageFollowProduct: page - 1,
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

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      beforeLoadFollowProduct: (state, action) => {
         state.follow.hasMore = true;
         state.follow.loadingMore = true;
      },
      setFollowKeySearchFromPageFollow: (state, action) => {
         state.follow.keySearchFromPageFollow = action.payload;
         state.follow.pageFollowProduct = -1;
         state.follow.loadingMore = false;
         state.follow.hasMore = false;
      },
      setFollowSortFromPageFollow: (state, action) => {
         state.follow.sortFromPageFollow = action.payload;
         state.follow.followProduct = [];
         state.follow.pageFollowProduct = -1;
         state.follow.loadingMore = false;
         state.follow.hasMore = false;
      },
      resetFollowProducts: (state) => {
         state.follow.followProduct = [];
         state.follow.pageFollowProduct = -1;
         state.follow.loadingMore = false;
         state.follow.hasMore = false;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(loadUser.fulfilled, (state, action) => {
            state.authLoading = false;
            state.isAuthenticated = action.payload.isAuthenticated;
            state.isVerify = action.payload.isVerify;
            state.user = action.payload.user;
         })
         .addCase(fetchFollowProducts.pending, (state) => {
            state.follow.hasMore = true;
            state.follow.loadingMore = true;
         })
         .addCase(fetchFollowProducts.fulfilled, (state, action) => {
            state.follow.loadingMore = false;
            state.follow.hasMore = action.payload.hasMore;
            state.follow.followProduct = [
               ...state.follow.followProduct,
               ...action.payload.followProduct,
            ];
            state.follow.pageFollowProduct = action.payload.pageFollowProduct;
         })
         .addCase(fetchFollowProducts.rejected, (state, action) => {
            state.follow.loadingMore = false;
            state.follow.hasMore = false;
            state.follow.error = action.error.message;
         });
   },
});

export const {
   setFollowKeySearchFromPageFollow,
   setFollowSortFromPageFollow,
   resetFollowProducts,
   beforeLoadFollowProduct,
} = authSlice.actions;

export default authSlice.reducer;
