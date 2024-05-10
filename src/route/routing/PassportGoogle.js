import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { LOCAL_STORAGE_TOKEN_NAME } from '../../config/constants';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '~/redux/slices/auth/authSlice';
import { authSelector } from '~/redux/selectors/auth/authSelector';

const PassportGoogle = () => {
   const [navigate, setNavigate] = useState(<></>);

   const dispatch = useDispatch();

   const { isAuthenticated } = useSelector(authSelector);

   const loginUserWithGoogle = async (accessToken) => {
      if (accessToken) {
         localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, accessToken);

         dispatch(loadUser());

         return true;
      } else {
         return false;
      }
   };

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

      // eslint-disable-next-line
   }, []);

   return navigate;
};

export default PassportGoogle;
