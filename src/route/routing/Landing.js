import { AuthContext } from '../contexts/auth/AuthContext';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';

const Landing = () => {
   const {
      authState: { isAuthenticated },
   } = useContext(AuthContext);

   if (!isAuthenticated) {
      return <Navigate to="/login" />;
   }
   return <Navigate to="/" />;
};

export default Landing;
