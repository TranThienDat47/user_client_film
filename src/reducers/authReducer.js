export const initialState = {
   authLoading: true,
   isAuthenticated: false,
   isVerify: false,
   user: null,
};

export const authReducer = (state, action) => {
   const {
      type,
      payload: { isAuthenticated, isVerify, user },
   } = action;

   switch (type) {
      case 'SET_AUTH':
         return {
            ...state,
            authLoading: false,
            isAuthenticated,
            isVerify,
            user,
         };
      default:
         return state;
   }
};
