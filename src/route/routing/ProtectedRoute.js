import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AuthContext } from '~/contexts/auth/AuthContext';

const ProtectedRoute = ({ curPath }) => {
   const {
      authState: { authLoading, isAuthenticated, isVerify },
   } = useContext(AuthContext);

   if (authLoading) return <div></div>;

   return isAuthenticated && isVerify ? <Outlet /> : <Navigate to="/login" />;
};
export default ProtectedRoute;
