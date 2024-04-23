import axios from 'axios';
import { createContext, useReducer, useEffect } from 'react';

import { authReducer, initialState } from '~/reducers/authReducer';
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from '../../config/constants';
import setAuthToken from '../../utils/setAuthToken';
import AuthServices from '~/services/AuthServices';
const AuthContext = createContext();

export { AuthContext };

const AuthContextProvider = ({ children }) => {
   const [authState, dispatch] = useReducer(authReducer, initialState);

   // Authenticate user
   const loadUser = async () => {
      const response = await AuthServices.authorization();

      if (response && response.success) {
         if (response.is_verify) {
            dispatch({
               type: 'SET_AUTH',
               payload: { isAuthenticated: true, isVerify: true, user: response.user },
            });
         } else if (!response.is_verify) {
            dispatch({
               type: 'SET_AUTH',
               payload: { isAuthenticated: true, isVerify: false, user: response.user },
            });
         } else if (!response.success) {
            dispatch({
               type: 'SET_AUTH',
               payload: { isAuthenticated: false, user: null },
            });
         }
      } else {
         localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);

         dispatch({
            type: 'SET_AUTH',
            payload: { isAuthenticated: false, user: null },
         });
      }
   };

   useEffect(() => {
      loadUser();
   }, []);

   const loginUserWithGoogle = async (accessToken) => {
      if (accessToken) {
         localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, accessToken);

         await loadUser();

         return true;
      } else {
         return false;
      }
   };

   const loginUser = async (userForm) => {
      try {
         const response = await AuthServices.loginUser(userForm);

         if (response && response.success) {
            localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.accessToken);

            await loadUser();
         }

         return response;
      } catch (error) {
         if (error.response) return error.response;
         else return { success: false, message: error.message.message };
      }
   };

   const registerUser = async (userForm) => {
      try {
         const response = await axios.post(`${apiUrl}/auth/register`, userForm);

         if (response.data.success) {
            localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, response.data.accessToken);
            await loadUser();
         }

         return response.data;
      } catch (error) {
         if (error.response.data) return error.response.data;
         else return { success: false, message: error.message.message };
      }
   };

   const logout = async () => {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
   };

   const verify = async (verifyForm) => {
      localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, verifyForm.accessToken);
      try {
         const response = await axios.get(`${apiUrl}/auth/verify`, {
            params: {
               email: verifyForm.email,
               token: verifyForm.token,
            },
         });

         if (response.data.success) {
            return { success: false, message: 'Verify invalid' };
         }
      } catch (error) {
         if (error.response.data) return error.response.data;
         else return { success: false, message: error.message.message };
      }
   };

   const authContextData = {
      loginUser,
      loginUserWithGoogle,
      registerUser,
      logout,
      authState,
      verify,
   };

   return <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
