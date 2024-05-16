// export const apiUrl =
//    process.env.NODE_ENV !== 'production'
//       ? 'http://localhost:5000/api'
//       : 'http://localhost:5000/api';

export const apiUrl =
   process.env.NODE_ENV !== 'production'
      ? 'https://server-web-manled.onrender.com/api'
      : 'https://server-web-manled.onrender.com/api';

// export const socketURL = 'wss://localhost:5000';
export const socketURL = 'wss://server-web-manled.onrender.com';

export const LOCAL_STORAGE_TOKEN_NAME = 'web-manled-token';
export const LOCAL_STORAGE_ACCOUNT_LOGIN = 'web-manled-account-login';
