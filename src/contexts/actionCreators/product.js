const fetchSuggestedProductsRequest = () => ({
   type: 'FETCH_SUGGESTED_PRODUCTS_REQUEST',
   payload: {},
});

const fetchSuggestedProductsSuccess = ({ suggestedProducts, hasMore, pageSuggestedProducts }) => ({
   type: 'FETCH_SUGGESTED_PRODUCTS_SUCCESS',
   payload: { suggestedProducts, hasMore, pageSuggestedProducts },
});

const fetchSuggestedProductsFailure = ({ error }) => ({
   type: 'FETCH_SUGGESTED_PRODUCTS_FAILURE',
   payload: { error },
});

const fetchNewProductsSuccess = ({ newProducts }) => ({
   type: 'FETCH_NEW_PRODUCTS_SUCCESS',
   payload: {
      newProducts,
   },
});

//search
const fetchResetSearchResult = () => ({
   type: 'RESET_RESULT_SEARCH',
   payload: {},
});

const setTeampSelectSearchResult = ({ tempSelectSearchResult }) => ({
   type: 'SET_TEMP_SELECT_SEARCH_RESULT_REQUEST',
   payload: { tempSelectSearchResult },
});

const setKeySearchProduct = ({ keySearch }) => ({
   type: 'FETCH_KEY_SEARCH_PRODUCTS_REQUEST',
   payload: { keySearch },
});

const fetchSearchResultProductsRequest = () => ({
   type: 'FETCH_SEARCH_RESULT_PRODUCTS_REQUEST',
   payload: {},
});

const fetchSearchResultProductsSuccess = ({
   searchResultProducts,
   hasMoreSearch,
   pageSearchResultProducts,
}) => ({
   type: 'FETCH_SEARCH_RESULT_PRODUCTS_SUCCESS',
   payload: { searchResultProducts, hasMoreSearch, pageSearchResultProducts },
});

const fetchSearchResultProductsFailure = ({ errorSearch }) => ({
   type: 'FETCH_SEARCH_RESULT_PRODUCTS_FAILURE',
   payload: { errorSearch },
});

//recommend
const fetchRecommendProductsRequest = () => ({
   type: 'FETCH_RECOMMEND_PRODUCTS_REQUEST',
   payload: {},
});

const fetchRecommendProductsSuccess = ({ recommendProducts, hasMore, pageRecommendProducts }) => ({
   type: 'FETCH_RECOMMEND_PRODUCTS_SUCCESS',
   payload: { recommendProducts, hasMore, pageRecommendProducts },
});

const fetchRecommendProductsFailure = ({ error }) => ({
   type: 'FETCH_RECOMMEND_PRODUCTS_FAILURE',
   payload: { error },
});

export {
   fetchSuggestedProductsRequest,
   fetchSuggestedProductsSuccess,
   fetchSuggestedProductsFailure,
   fetchNewProductsSuccess,
   fetchResetSearchResult,
   fetchSearchResultProductsRequest,
   fetchSearchResultProductsSuccess,
   fetchSearchResultProductsFailure,
   setKeySearchProduct,
   setTeampSelectSearchResult,
   fetchRecommendProductsRequest,
   fetchRecommendProductsSuccess,
   fetchRecommendProductsFailure,
};
