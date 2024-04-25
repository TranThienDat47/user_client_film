export const initialState = {
   productCurrent: {},
   theme: {},
   language: null,
   loading: true,
   error: null,
};

const cases = [
   {
      type: 'FETCH_PRODUCT_CURRENT_REQUEST',
      returnData: (state) => ({
         ...state,
         loading: true,
      }),
   },
   {
      type: 'FETCH_PRODUCT_CURRENT_SUCCESS',
      returnData: (state, { productCurrent }) => ({
         ...state,
         loading: false,
         productCurrent,
      }),
   },
   {
      type: 'FETCH_PRODUCT_CURRENT_FAILURE',
      returnData: (state, { error }) => ({
         ...state,
         loading: false,
         error,
      }),
   },
];

export const globalReducer = (state, action) => {
   const selectedCase = cases.find((item) => item.type === action.type);

   if (selectedCase) {
      return selectedCase.returnData(state, action.payload);
   } else {
      return state;
   }
};
