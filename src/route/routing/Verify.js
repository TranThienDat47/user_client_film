import { Navigate } from 'react-router-dom';
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from '../../config/constants';
import axios from 'axios';

const Verify = () => {
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

   const urlParams = new URLSearchParams(window.location.search);
   const email = urlParams.get('email');
   const token = urlParams.get('token');
   const accessToken = urlParams.get('hashToken');

   const verifyForm = {
      email,
      token,
      accessToken,
   };

   const verifyProgress = async () => {
      await verify(verifyForm);
   };

   verifyProgress();

   return <Navigate to="/" />;
};

export default Verify;
