import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthServices from '~/services/AuthServices';
import FollowService from '~/services/FollowService';
import SeeLaterMovieService from '~/services/SeeLaterMovieService';
import SeenMovieService from '~/services/SeenMovieService';

const LENGTH_PAGE_FOLLOW = 9;

const initialState = {
   isAuthenticated: false,
   isVerify: false,
   user: null,
   authLoading: true,
   follow: {
      followProduct: [],
      keySearchFromPageFollow: '',
      pageFollowProduct: 0,
      sortFromPageFollow: 1,
      loadingMore: false,
      hasMore: true,
      error: null,
   },

   seenMovie: {
      keySearchFromPageSeenMovie: '',
      sortFromPageSeenMovie: 1,
      pageSeenMovieProduct: 0,
      seenMovieProduct: [],
      loadingMore: false,
      hasMore: true,
      error: null,
   },

   seeLaterMovie: {
      keySearchFromPageSeeLaterMovie: '',
      sortFromPageSeeLaterMovie: 1,
      pageSeeLaterMovieProduct: 0,
      seeLaterMovieProduct: [],
      loadingMore: false,
      hasMore: true,
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
            if (response.follows?.length >= LENGTH_PAGE_FOLLOW) {
               return {
                  followProduct: response.follows,
                  hasMore: true,
                  pageFollowProduct: page,
               };
            } else if (
               response.follows?.length > 0 &&
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

export const fetchSeenMovieProducts = createAsyncThunk(
   'auth/fetchSeenMovieProducts',
   async (page, { getState, rejectWithValue }) => {
      const state = getState().auth;
      const { _id: user_id } = state.user;
      const { seenMovie } = state;

      try {
         const response = await SeenMovieService.getListSeenMovie({
            skip: page * LENGTH_PAGE_FOLLOW,
            limit: LENGTH_PAGE_FOLLOW,
            user_id,
            keySearch: seenMovie.keySearchFromPageSeenMovie,
            sort: seenMovie.sortFromPageSeenMovie,
         });

         if (response.success) {
            if (response.seenMovies?.length >= LENGTH_PAGE_FOLLOW) {
               return {
                  seenMovieProduct: response.seenMovies,
                  hasMore: true,
                  pageSeenMovieProduct: page,
               };
            } else if (
               response.seenMovies?.length > 0 &&
               response.seenMovies.length < LENGTH_PAGE_FOLLOW
            ) {
               return {
                  seenMovieProduct: response.seenMovies,
                  hasMore: false,
                  pageSeenMovieProduct: page,
               };
            } else if (response.seenMovies.length <= 0) {
               return {
                  seenMovieProduct: response.seenMovies,
                  hasMore: false,
                  pageSeenMovieProduct: page - 1,
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

export const fetchSeeLaterMovieProducts = createAsyncThunk(
   'auth/fetchSeeLaterMovieProducts',
   async (page, { getState, rejectWithValue }) => {
      const state = getState().auth;
      const { _id: user_id } = state.user;
      const { seeLaterMovie } = state;

      try {
         const response = await SeeLaterMovieService.getListSeeLaterMovie({
            skip: page * LENGTH_PAGE_FOLLOW,
            limit: LENGTH_PAGE_FOLLOW,
            user_id,
            keySearch: seeLaterMovie.keySearchFromPageSeeLaterMovie,
            sort: seeLaterMovie.sortFromPageSeeLaterMovie,
         });

         if (response.success) {
            if (response.seeLaterMovies?.length >= LENGTH_PAGE_FOLLOW) {
               return {
                  seeLaterMovieProduct: response.seeLaterMovies,
                  hasMore: true,
                  pageSeeLaterMovieProduct: page,
               };
            } else if (
               response.seeLaterMovies?.length > 0 &&
               response.seeLaterMovies.length < LENGTH_PAGE_FOLLOW
            ) {
               return {
                  seeLaterMovieProduct: response.seeLaterMovies,
                  hasMore: false,
                  pageSeeLaterMovieProduct: page,
               };
            } else if (response.seeLaterMovies.length <= 0) {
               return {
                  seeLaterMovieProduct: response.seeLaterMovies,
                  hasMore: false,
                  pageSeeLaterMovieProduct: page - 1,
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
         state.follow.pageFollowProduct = 0;
         state.follow.loadingMore = false;
         state.follow.hasMore = true;
      },
      setFollowSortFromPageFollow: (state, action) => {
         state.follow.sortFromPageFollow = action.payload;
         state.follow.followProduct = [];
         state.follow.pageFollowProduct = 0;
         state.follow.loadingMore = false;
         state.follow.hasMore = true;
      },
      resetFollowProducts: (state) => {
         state.follow.followProduct = [];
         state.follow.pageFollowProduct = 0;
         state.follow.loadingMore = false;
         state.follow.hasMore = true;
      },
      //seenMovie
      beforeLoadSeenMovieProduct: (state, action) => {
         state.seenMovie.hasMore = true;
         state.seenMovie.loadingMore = true;
      },
      setSeenMovieKeySearchFromPageSeenMovie: (state, action) => {
         state.seenMovie.keySearchFromPageSeenMovie = action.payload;
         state.seenMovie.pageSeenMovieProduct = -1;
         state.seenMovie.loadingMore = false;
         state.seenMovie.hasMore = false;
      },
      setSeenMovieSortFromPageSeenMovie: (state, action) => {
         state.seenMovie.sortFromPageSeenMovie = action.payload;
         state.seenMovie.seenMovieProduct = [];
         state.seenMovie.pageSeenMovieProduct = -1;
         state.seenMovie.loadingMore = false;
         state.seenMovie.hasMore = false;
      },
      resetSeenMovieProducts: (state) => {
         state.seenMovie.seenMovieProduct = [];
         state.seenMovie.pageSeenMovieProduct = -1;
         state.seenMovie.loadingMore = false;
         state.seenMovie.hasMore = false;
      },

      //see later movie
      beforeLoadSeeLaterMovieProduct: (state, action) => {
         state.seeLaterMovie.hasMore = true;
         state.seeLaterMovie.loadingMore = true;
      },
      setSeeLaterMovieKeySearchFromPageSeeLaterMovie: (state, action) => {
         state.seeLaterMovie.keySearchFromPageSeeLaterMovie = action.payload;
         state.seeLaterMovie.pageSeeLaterMovieProduct = -1;
         state.seeLaterMovie.loadingMore = false;
         state.seeLaterMovie.hasMore = false;
      },
      setSeeLaterMovieSortFromPageSeeLaterMovie: (state, action) => {
         state.seeLaterMovie.sortFromPageSeeLaterMovie = action.payload;
         state.seeLaterMovie.seeLaterMovieProduct = [];
         state.seeLaterMovie.pageSeeLaterMovieProduct = -1;
         state.seeLaterMovie.loadingMore = false;
         state.seeLaterMovie.hasMore = false;
      },
      resetSeeLaterMovieProducts: (state) => {
         state.seeLaterMovie.seeLaterMovieProduct = [];
         state.seeLaterMovie.pageSeeLaterMovieProduct = -1;
         state.seeLaterMovie.loadingMore = false;
         state.seeLaterMovie.hasMore = false;
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

      builder
         .addCase(fetchSeenMovieProducts.pending, (state) => {
            state.seenMovie.hasMore = true;
            state.seenMovie.loadingMore = true;
         })
         .addCase(fetchSeenMovieProducts.fulfilled, (state, action) => {
            state.seenMovie.loadingMore = false;
            state.seenMovie.hasMore = action.payload.hasMore;
            state.seenMovie.seenMovieProduct = [
               ...state.seenMovie.seenMovieProduct,
               ...action.payload.seenMovieProduct,
            ];
            state.seenMovie.pageSeenMovieProduct = action.payload.pageSeenMovieProduct;
         })
         .addCase(fetchSeenMovieProducts.rejected, (state, action) => {
            state.seenMovie.loadingMore = false;
            state.seenMovie.hasMore = false;
            state.seenMovie.error = action.error.message;
         });

      builder
         .addCase(fetchSeeLaterMovieProducts.pending, (state) => {
            state.seeLaterMovie.hasMore = true;
            state.seeLaterMovie.loadingMore = true;
         })
         .addCase(fetchSeeLaterMovieProducts.fulfilled, (state, action) => {
            state.seeLaterMovie.loadingMore = false;
            state.seeLaterMovie.hasMore = action.payload.hasMore;
            state.seeLaterMovie.seeLaterMovieProduct = [
               ...state.seeLaterMovie.seeLaterMovieProduct,
               ...action.payload.seeLaterMovieProduct,
            ];
            state.seeLaterMovie.pageSeeLaterMovieProduct = action.payload.pageSeeLaterMovieProduct;
         })
         .addCase(fetchSeeLaterMovieProducts.rejected, (state, action) => {
            state.seeLaterMovie.loadingMore = false;
            state.seeLaterMovie.hasMore = false;
            state.seeLaterMovie.error = action.error.message;
         });
   },
});

export const {
   //follow
   resetFollowProducts,
   beforeLoadFollowProduct,
   setFollowSortFromPageFollow,
   setFollowKeySearchFromPageFollow,

   //seen Movie
   resetSeenMovieProducts,
   beforeLoadSeenMovieProduct,
   setSeenMovieSortFromPageSeenMovie,
   setSeenMovieKeySearchFromPageSeenMovie,

   //see later movie
   resetSeeLaterMovieProducts,
   beforeLoadSeeLaterMovieProduct,
   setSeeLaterMovieSortFromPageSeeLaterMovie,
   setSeeLaterMovieKeySearchFromPageSeeLaterMovie,
} = authSlice.actions;

export default authSlice.reducer;
