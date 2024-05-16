export const apiUrl =
   process.env.NODE_ENV !== 'production'
      ? 'https://server-web-manled.onrender.com/api'
      : 'https://server-web-manled.onrender.com/api';

export const socketURL = 'https://server-web-manled.onrender.com';

export const LOCAL_STORAGE_TOKEN_NAME = 'web-manled-token';
export const LOCAL_STORAGE_ACCOUNT_LOGIN = 'web-manled-account-login';
