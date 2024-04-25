export const initialState = {
   authLoading: true,
   isAuthenticated: false,
   isVerify: false,
   user: null,
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
];

export const authReducer = (state, action) => {
   const selectedCase = cases.find((item) => item.type === action.type);

   if (selectedCase) {
      return selectedCase.returnData(state, action.payload);
   } else {
      return state;
   }
};
