import axios from 'axios';

import { apiUrl } from '~/config/constants';

// import setAuthToken from '~/utils/setAuthToken';

class NotificationServices {
   async fetchNotifications({ user_id }) {
      try {
         const response = await axios.post(`${apiUrl}/notification`, { user_id });

         return response.data;
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async readNotification({ list_notification }) {
      try {
         const response = await axios.post(`${apiUrl}/notification/read`, { list_notification });

         return response.data;
      } catch (error) {
         return { success: false, message: error.message };
      }
   }

   async countUnread({ user_id }) {
      try {
         const response = await axios.get(`${apiUrl}/notification/${user_id}`);

         return response.data;
      } catch (error) {
         return { success: false, message: error.message };
      }
   }
}

export default new NotificationServices();
