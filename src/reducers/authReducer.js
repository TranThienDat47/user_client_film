export const initialState = {
   authLoading: true,
   isAuthenticated: false,
   isVerify: false,
   user: null,

   //follow
   keySearchFromPageFollow: '',
   sortFromPageFollow: 1,
   followProduct: [],
   pageFollowProducts: -1,
   hasMoreFollow: false,
   loadingMoreFollow: false,
   errorFollow: null,
};

const cases = [
   {
      type: 'SET_AUTH',
      returnData: (state, { isAuthenticated, isVerify, user }) => ({
         ...state,
         authLoading: false,
         isAuthenticated,
         isVerify,
         user,
      }),
   },

   //follow
   {
      type: 'SET_SORT_FOLLOW_PRODUCT',
      returnData: (state, { sortFromPageFollow }) => {
         return {
            ...state,
            sortFromPageFollow,
            pageFollowProducts: -1,
            hasMoreFollow: false,
            loadingMoreFollow: false,
            followProduct: [],
         };
      },
   },
   {
      type: 'RESET_FOLLOW_PRODUCTS',
      returnData: (state) => ({
         ...state,
         followProduct: [],
      }),
   },
   {
      type: 'SET_KEY_SEARCH_FROM_PAGE_FOLLOW',
      returnData: (state, { keySearchFromPageFollow }) => ({
         ...state,
         pageFollowProducts: -1,
         hasMoreFollow: false,
         loadingMoreFollow: false,
         keySearchFromPageFollow,
      }),
   },
   {
      type: 'FETCH_FOLLOW_PRODUCTS_REQUEST',
      returnData: (state) => ({
         ...state,
         loadingMoreFollow: true,
         hasMoreFollow: true,
      }),
   },
   {
      type: 'FETCH_FOLLOW_PRODUCTS_SUCCESS',
      returnData: (state, { followProduct, hasMoreFollow, pageFollowProducts }) => {
         return {
            ...state,
            loadingMoreFollow: false,
            followProduct: [...state.followProduct, ...followProduct],
            hasMoreFollow,
            pageFollowProducts,
         };
      },
   },
   {
      type: 'FETCH_FOLLOW_PRODUCTS_FAILURE',
      returnData: (state, { errorFollow }) => ({
         ...state,
         loadingMoreFollow: false,
         errorFollow,
      }),
   },
];

export const authReducer = (state, action) => {
   const selectedCase = cases.find((item) => item.type === action.type);

   if (selectedCase) {
      return selectedCase.returnData(state, action.payload);
   } else {
      return state;
   }
};
