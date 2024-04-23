import { Navigate } from 'react-router-dom';
import { useContext } from 'react';

import { AuthContext } from '~/contexts/auth/AuthContext';

const Verify = () => {
   const { verify } = useContext(AuthContext);

   const urlParams = new URLSearchParams(window.location.search);
   const email = urlParams.get('email');
   const token = urlParams.get('token');
   const accessToken = urlParams.get('hashToken');

   const verifyForm = {
      email,
      token,
      accessToken,
   };

   const verifyProgress = async () => {
      await verify(verifyForm);
   };

   verifyProgress();

   return <Navigate to="/" />;
};

export default Verify;
