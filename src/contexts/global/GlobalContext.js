import { createContext, useReducer, useEffect, useState } from 'react';

import ProductServices from '~/services/ProductServices';
import { globalReducer, initialState } from '~/reducers/globalReducer';

import {
   fetchProductCurrentRequest,
   fetchProductCurrentSuccess,
   fetchProductCurrentFailure,
} from '../actionCreators/global';

const GlobalContext = createContext();

export { GlobalContext };

const GlobalContextProvider = ({ children }) => {
   const [globalState, dispatch] = useReducer(globalReducer, initialState);

   const setProductCurrent = async ({ _id }) => {
      dispatch(fetchProductCurrentRequest());

      const response = await ProductServices.show({ product_id: _id });

      if (response.success)
         dispatch(
            fetchProductCurrentSuccess({
               productCurrent: {
                  product: response.products,
                  product_details: response.productDetails,
               },
            }),
         );
      else {
      }
   };

   const globalContextData = { globalState, setProductCurrent };

   return <GlobalContext.Provider value={globalContextData}> {children}</GlobalContext.Provider>;
};

export default GlobalContextProvider;
