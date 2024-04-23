import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { AuthContext } from '~/contexts/auth/AuthContext';

const PassportGoogle = () => {
   const [navigate, setNavigate] = useState(<></>);

   const {
      loginUserWithGoogle,
      authState: { isAuthenticated },
   } = useContext(AuthContext);

   const urlParams = new URLSearchParams(window.location.search);
   const token = urlParams.get('accessToken');

   const handleLoginUserWithGoogle = async () => {
      await loginUserWithGoogle(token);
   };

   useEffect(() => {
      handleLoginUserWithGoogle()
         .then(() => {
            if (isAuthenticated) setNavigate(<Navigate to="/" />);
            else setNavigate(<Navigate to="login" />);
         })
         .catch(() => {
            setNavigate(<Navigate to="login" />);
         });
   }, []);

   return navigate;
};

export default PassportGoogle;
