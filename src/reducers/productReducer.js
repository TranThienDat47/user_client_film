export const initialState = {
   newProducts: [],
   allProducts: [],
   suggestedProducts: [],
   pageSuggestedProducts: -1,

   recommendProducts: [],
   pageRecommendProducts: -1,

   searchResultProducts: [],
   searchSuggestedProducts: [],
   pageSearchResultProducts: -1,
   keySearch: '',
   tempSelectSearchResult: '',

   hasMore: false,
   loading: false,
   loadingMore: false,
   error: null,
};

const cases = [
   //search
   {
      type: 'SET_TEMP_SELECT_SEARCH_RESULT_REQUEST',
      returnData: (state, { tempSelectSearchResult }) => ({
         ...state,
         tempSelectSearchResult,
      }),
   },
   {
      type: 'FETCH_SEARCH_SUGGESTED_PRODUCTS_REQUEST',
      returnData: (state) => ({
         ...state,
         loading: true,
      }),
   },
   {
      type: 'FETCH_SEARCH_SUGGESTED_PRODUCTS_SUCCESS',
      returnData: (state, { searchSuggestedProducts }) => ({
         ...state,
         loading: false,
         searchSuggestedProducts,
      }),
   },
   {
      type: 'FETCH_SEARCH_SUGGESTED_PRODUCTS_FAILURE',
      returnData: (state, { error }) => ({
         ...state,
         loading: false,
         error,
      }),
   },
   {
      type: 'FETCH_KEY_SEARCH_PRODUCTS_REQUEST',
      returnData: (state, { keySearch }) => ({
         ...state,
         // pageSearchResultProducts: -1,
         // searchResultProducts: [],
         keySearch,
      }),
   },
   {
      type: 'FETCH_SEARCH_RESULT_PRODUCTS_REQUEST',
      returnData: (state) => ({
         ...state,
         loadingMore: true,
         hasMore: true,
      }),
   },
   {
      type: 'FETCH_SEARCH_RESULT_PRODUCTS_SUCCESS',
      returnData: (state, { searchResultProducts, hasMore, pageSearchResultProducts }) => ({
         ...state,
         loadingMore: false,
         searchResultProducts: [...state.searchResultProducts, ...searchResultProducts],
         hasMore,
         pageSearchResultProducts,
      }),
   },
   {
      type: 'FETCH_SEARCH_RESULT_PRODUCTS_FAILURE',
      returnData: (state, { error }) => ({
         ...state,
         loadingMore: false,
         error,
      }),
   },

   //new product
   {
      type: 'FETCH_NEW_PRODUCTS_SUCCESS',
      returnData: (state, { newProducts }) => ({
         ...state,
         loading: false,
         newProducts,
      }),
   },
   //suggested products
   {
      type: 'FETCH_SUGGESTED_PRODUCTS_REQUEST',
      returnData: (state) => ({
         ...state,
         loadingMore: true,
         hasMore: true,
      }),
   },
   {
      type: 'FETCH_SUGGESTED_PRODUCTS_SUCCESS',
      returnData: (state, { suggestedProducts, hasMore, pageSuggestedProducts }) => ({
         ...state,
         loadingMore: false,
         suggestedProducts: [...state.suggestedProducts, ...suggestedProducts],
         hasMore,
         pageSuggestedProducts,
      }),
   },
   {
      type: 'FETCH_SUGGESTED_PRODUCTS_FAILURE',
      returnData: (state, { error }) => ({
         ...state,
         loadingMore: false,
         error,
      }),
   },

   //recommend products
   {
      type: 'FETCH_RECOMMEND_PRODUCTS_REQUEST',
      returnData: (state) => ({
         ...state,
         loadingMore: true,
         hasMore: true,
      }),
   },
   {
      type: 'FETCH_RECOMMEND_PRODUCTS_SUCCESS',
      returnData: (state, { recommendProducts, hasMore, pageRecommendProducts }) => ({
         ...state,
         loadingMore: false,
         recommendProducts: [...state.recommendProducts, ...recommendProducts],
         hasMore,
         pageRecommendProducts,
      }),
   },
   {
      type: 'FETCH_RECOMMEND_PRODUCTS_FAILURE',
      returnData: (state, { error }) => ({
         ...state,
         loadingMore: false,
         error,
      }),
   },

   //all products
   {
      type: 'FETCH_ALL_PRODUCTS_SUCCESS',
      returnData: (state, { allProducts }) => ({
         ...state,
         allProducts,
      }),
   },
];

export const productReducer = (state, action) => {
   const selectedCase = cases.find((item) => item.type === action.type);

   if (selectedCase) {
      return selectedCase.returnData(state, action.payload);
   } else {
      return state;
   }
};
