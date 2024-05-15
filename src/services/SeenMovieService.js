import axios from 'axios';

import { apiUrl } from '~/config/constants';

class SeenMovieService {
   async getListSeenMovie({ skip = null, limit = null, user_id = null, keySearch = '', sort = 1 }) {
      try {
         const response = await axios.post(`${apiUrl}/seenMovie/list_seenMovie`, {
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

   async checkIsSeenMovie({ user_id, ref_id }) {
      try {
         const response = await axios.post(`${apiUrl}/seenMovie/check_seenMovie`, {
            user_id,
            ref_id,
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }

   async seenMovie({ user_id, ref_id }) {
      try {
         const response = await axios.post(`${apiUrl}/seenMovie/seenMovie`, {
            user_id,
            ref_id,
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }

   async unseenMovie({ user_id, ref_id }) {
      try {
         const response = await axios.delete(`${apiUrl}/seenMovie/unseenMovie`, {
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

export default new SeenMovieService();
