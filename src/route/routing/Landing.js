import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { authSelector } from '~/redux/selectors/auth/authSelector';

const Landing = () => {
   const { isAuthenticated } = useSelector(authSelector);

   if (!isAuthenticated) {
      return <Navigate to="/login" />;
   }
   return <Navigate to="/" />;
};

export default Landing;
