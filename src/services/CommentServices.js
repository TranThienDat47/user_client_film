import axios from 'axios';

import { apiUrl } from '~/config/constants';

class CommentServices {
   constructor() {
      this.isLiking = false;
   }

   async getCountComment({ parent_id = null }) {
      try {
         const response = await axios.get(`${apiUrl}/comments/${parent_id}`);

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }

   async fetchComments({ parent_id = null, skip = null, limit = null, sort = 1 }) {
      try {
         const response = await axios.get(`${apiUrl}/comments`, {
            params: {
               parent_id,
               skip,
               limit,
               sort,
            },
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }

   async addComment({
      parent_id = null,
      user_id = null,
      content = '',
      reply_with = {},
      isReply = false,
   }) {
      try {
         const response = await axios.post(`${apiUrl}/comments`, {
            parent_id,
            user_id,
            content,
            reply_with,
            isReply,
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }

   async checkUserLikeComment({ comment_id, user_id }) {
      try {
         const response = await axios.post(`${apiUrl}/comments/check_user_like_comment`, {
            comment_id,
            user_id,
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.message };

         return { success: false, message: error.message };
      }
   }

   async addCommentReply({
      parent_id = null,
      user_id = null,
      content = '',
      reply_with = {},
      isReply = false,
      user_receiver_id = null,
   }) {
      try {
         const response = await axios.post(`${apiUrl}/comments`, {
            parent_id,
            user_id,
            content,
            reply_with,
            isReply,
         });

         if (response.data.success && user_id !== user_receiver_id) {
            await axios.post(`${apiUrl}/notification/reply_comment`, {
               ref_id: parent_id,
               user_id: user_receiver_id,
               user_send_id: user_id,
               comment: content,
            });
         }

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.response };

         return { success: false, message: error.message };
      }
   }

   async checkUserLikeComment({ comment_id, user_id }) {
      try {
         const response = await axios.post(`${apiUrl}/comments/check_user_like_comment`, {
            comment_id,
            user_id,
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.message };

         return { success: false, message: error.message };
      }
   }

   async likeComment({ comment_id, user_id, user_send_id, content = '' }) {
      try {
         if (this.isLiking) {
            return { success: false, message: 'Yêu cầu like đang được xử lý' };
         }

         this.isLiking = true;

         const response = await axios.post(`${apiUrl}/comments/like`, {
            comment_id,
            user_id: user_send_id,
         });

         if (response.data.success) {
            if (user_id !== user_send_id) {
               const sendNotification = await axios.post(`${apiUrl}/notification/like_comment`, {
                  ref_id: comment_id,
                  user_id,
                  user_send_id,
                  comment: content,
               });

               if (sendNotification.data.success) {
                  return { success: true };
               }

               return { success: false };
            } else {
               return { success: true };
            }
         }
      } catch (error) {
         if (error.response) return { success: false, message: error.message };

         return { success: false, message: error.message };
      } finally {
         this.isLiking = false;
      }
   }

   async disLikeComment({ comment_id, user_id }) {
      try {
         const response = await axios.post(`${apiUrl}/comments/dislike`, {
            comment_id,
            user_id,
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.message };

         return { success: false, message: error.message };
      }
   }

   async getNumLikeComment({ comment_detail_id }) {
      try {
         const response = await axios.post(`${apiUrl}/comments/num_like`, {
            comment_detail_id,
         });

         return response.data;
      } catch (error) {
         if (error.response) return { success: false, message: error.message };

         return { success: false, message: error.message };
      }
   }
}

export default new CommentServices();
