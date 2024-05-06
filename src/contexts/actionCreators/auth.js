//follow
const fetchSortFollowProduct = ({ sortFromPageFollow }) => ({
   type: 'SET_SORT_FOLLOW_PRODUCT',
   payload: { sortFromPageFollow },
});

const fetchResetFollowProducts = () => ({
   type: 'RESET_FOLLOW_PRODUCTS',
   payload: {},
});

const fetchKeySearchFromPageFollow = ({ keySearchFromPageFollow = '' }) => ({
   type: 'SET_KEY_SEARCH_FROM_PAGE_FOLLOW',
   payload: { keySearchFromPageFollow },
});

const fetchFollowProductsRequest = () => ({
   type: 'FETCH_FOLLOW_PRODUCTS_REQUEST',
   payload: {},
});

const fetchFollowProductsSuccess = ({ followProduct, hasMoreFollow, pageFollowProducts }) => ({
   type: 'FETCH_FOLLOW_PRODUCTS_SUCCESS',
   payload: { followProduct, hasMoreFollow, pageFollowProducts },
});

const fetchFollowProductsFailure = ({ errorFollow }) => ({
   type: 'FETCH_FOLLOW_PRODUCTS_FAILURE',
   payload: { errorFollow },
});

export {
   //follow
   fetchFollowProductsRequest,
   fetchFollowProductsSuccess,
   fetchFollowProductsFailure,
   fetchKeySearchFromPageFollow,
   fetchResetFollowProducts,
   fetchSortFollowProduct,
};
