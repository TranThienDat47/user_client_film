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

   async getProductOfCategory({ catgories_id, skip, limit, recently = true }) {
      try {
         const response = await axios.get(
            `${apiUrl}/products/get_product_of_category?categories_id=${catgories_id}&skip=${skip}&limit=${limit}&recently=${recently}`,
         );

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }
}

export default new CategoriesService();
