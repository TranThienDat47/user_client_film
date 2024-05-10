import { LOCAL_STORAGE_TOKEN_NAME } from '../../config/constants';

const Logout = () => {
   const logout = async () => {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
   };

   logout().then(() => {
      window.location = '/';
   });

   return <></>;
};

export default Logout;
