import axios from 'axios';

import { apiUrl } from '~/config/constants';

class ProductServices {
   async search({ skip, limit, recently = false, key = null }) {
      try {
         const response = await axios.get(
            `${apiUrl}/products/search?skip=${skip}&limit=${limit}${
               key ? '&key=' + key : ''
            }&recently=${recently}`,
         );

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }

   async show({ product_id }) {
      try {
         const response = await axios.get(`${apiUrl}/products/${product_id}`);

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }

   // async getEpisodesOfProduct({ product_id }) {
   //    try {
   //       const response = await axios.get(`${apiUrl}/
   //    } catch (error) { }
   // }
}

export default new ProductServices();
