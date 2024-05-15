import axios from 'axios';

import { apiUrl } from '~/config/constants';

class SeeLaterMovieService {
   async getListSeeLaterMovie({
      skip = null,
      limit = null,
      user_id = null,
      keySearch = '',
      sort = 1,
   }) {
      try {
         const response = await axios.post(`${apiUrl}/seeLaterMovie/list_seeLaterMovie`, {
            user_id,
            limit,
            skip,
            keySearch,
            sort,
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }
   async checkIsSeeLaterMovie({ user_id, ref_id }) {
      try {
         const response = await axios.post(`${apiUrl}/seeLaterMovie/check_seeLaterMovie`, {
            user_id,
            ref_id,
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }

   async seeLaterMovie({ user_id, ref_id }) {
      try {
         const response = await axios.post(`${apiUrl}/seeLaterMovie/seeLaterMovie`, {
            user_id,
            ref_id,
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }

   async unseeLaterMovie({ user_id, ref_id }) {
      try {
         const response = await axios.delete(`${apiUrl}/seeLaterMovie/unseeLaterMovie`, {
            params: {
               user_id,
               ref_id,
            },
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }
}

export default new SeeLaterMovieService();
