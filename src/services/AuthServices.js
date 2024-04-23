import axios from 'axios';

import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from '~/config/constants';
import setAuthToken from '~/utils/setAuthToken';

class AuthServices {
   async authorization() {
      if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
         setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
      }

      if (axios.defaults.headers.common['Authorization'])
         try {
            const response = await axios.get(`${apiUrl}/auth`);

            return response.data;
         } catch (error) {
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);

            if (error.response) return { success: false, message: error.response };

            return { success: false, message: error.message };
         }
   }

   async register(userForm) {
      try {
         const response = await axios.post(`${apiUrl}/auth/register`, userForm);

         return response.data;
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async loginUser(userForm) {
      try {
         const response = await axios.post(`${apiUrl}/auth/login`, userForm);

         return response.data;
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async checkUsername(userForm) {
      try {
         const response = await axios.post(`${apiUrl}/auth/login/check_account_valid`, userForm);

         return response.data;
      } catch (error) {
         return { success: false, message: error.message };
      }
   }
}

export default new AuthServices();
