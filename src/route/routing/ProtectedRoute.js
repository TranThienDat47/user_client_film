import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { authSelector } from '~/redux/selectors/auth/authSelector';

const ProtectedRoute = ({ curPath }) => {
   const { authLoading, isAuthenticated, isVerify } = useSelector(authSelector);

   if (authLoading) return <div></div>;

   return isAuthenticated && isVerify ? <Outlet /> : <Navigate to="/login" />;
};
export default ProtectedRoute;
