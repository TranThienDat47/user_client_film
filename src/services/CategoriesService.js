import axios from 'axios';

import { apiUrl } from '~/config/constants';

class CategoriesService {
   async getAll() {
      try {
         const response = await axios.get(`${apiUrl}/categories`);

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }
}

export default new CategoriesService();
