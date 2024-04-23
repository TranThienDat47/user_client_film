export const initialState = {
   productCurrent: {},
   theme: {},
   language: null,
   loading: true,
   error: null,
};

export const globalReducer = (state, action) => {
   const {
      type,
      payload: { productCurrent, theme, language, error },
   } = action;

   switch (type) {
      case 'FETCH_PRODUCT_CURRENT_REQUEST':
         return {
            ...state,
            loading: true,
         };
      case 'FETCH_PRODUCT_CURRENT_SUCCESS':
         return {
            ...state,
            loading: false,
            productCurrent,
         };
      case 'FETCH_PRODUCT_CURRENT_FAILURE':
         return {
            ...state,
            loading: false,
            error,
         };
      default:
         return state;
   }
};
