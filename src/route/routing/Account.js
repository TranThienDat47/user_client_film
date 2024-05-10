import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { authSelector } from '~/redux/selectors/auth/authSelector';

const ProtectedRoute = ({ curPath }) => {
   const { authLoading, isAuthenticated, isVerify } = useSelector(authSelector);

   if (authLoading) return <div className="spinner-container"></div>;
   if (!isAuthenticated || !isVerify) {
      return <Outlet />;
   }
   return <Navigate to="/dashboard" />;
};
export default ProtectedRoute;
