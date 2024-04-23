import { useContext } from 'react';

import { AuthContext } from '~/contexts/auth/AuthContext';

const Logout = () => {
   const { logout } = useContext(AuthContext);

   const urlParams = new URLSearchParams(window.location.search);
   const prevURL = urlParams.get('prevURL') || '';

   logout().then(() => {
      window.location = '/';
   });

   return <></>;
};

export default Logout;
