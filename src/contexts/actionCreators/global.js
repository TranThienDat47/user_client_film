const fetchProductCurrentRequest = () => ({
   type: 'FETCH_PRODUCT_CURRENT_REQUEST',
   payload: {},
});

const fetchProductCurrentSuccess = ({ productCurrent }) => ({
   type: 'FETCH_PRODUCT_CURRENT_SUCCESS',
   payload: { productCurrent },
});

const fetchProductCurrentFailure = ({ error }) => ({
   type: 'FETCH_PRODUCT_CURRENT_FAILURE',
   payload: { error },
});

export { fetchProductCurrentRequest, fetchProductCurrentSuccess, fetchProductCurrentFailure };
