import axios from 'axios';

import { apiUrl } from '~/config/constants';

class FollowService {
   async checkIsFollow({ user_id, ref_id }) {
      try {
         const response = await axios.post(`${apiUrl}/follow/check_follow`, {
            user_id,
            ref_id,
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }

   async follow({ user_id, ref_id }) {
      try {
         const response = await axios.post(`${apiUrl}/follow/follow`, {
            user_id,
            ref_id,
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }

   async unfollow({ user_id, ref_id }) {
      try {
         const response = await axios.post(`${apiUrl}/follow/unfollow`, {
            user_id,
            ref_id,
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }
}

export default new FollowService();
