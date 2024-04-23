import { useContext, useState } from 'react';
import classNames from 'classnames/bind';
import axios from 'axios';

import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from '~/config/constants';
import RegisterForm from '~/views/Auth/components/RegisterForm';
import LoginForm from '~/views/Auth/components/LoginForm';
import { AuthContext } from '~/contexts/auth';

import styles from './Auth.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

const Auth = ({ authRoute }) => {
   const {
      authState: { isAuthenticated, isVerify, user },
   } = useContext(AuthContext);

   const [content, setContent] = useState('Vui lòng truy cập gmail để xác nhận email...');

   const onClickReSend = async (e) => {
      setContent('Đã gửi lại link xác nhận! vui lòng truy cập gmail để xác nhận email...');
      const email = user.username;
      const accessToken = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);

      try {
         await axios.post(`${apiUrl}/auth/login/resend`, { email, accessToken });
      } catch (error) {
         if (error.response.data) return error.response.data;
         else return { success: false, message: error.message.message };
      }
   };

   let body;

   if (isAuthenticated && !isVerify) {
      body = (
         <div className={cx('confirm')}>
            <h3 style={{ color: 'red' }}>{content}</h3>
            <Button type="submit" className={cx('button')} onClick={(e) => onClickReSend(e)}>
               Gửi lại gmail xác nhận!
            </Button>
            <Button href="/logout" variant="danger" className={cx('button', 'danger')}>
               Đăng xuất!
            </Button>
         </div>
      );
   } else {
      body = (
         <>
            {authRoute === 'login' && <LoginForm />}
            {authRoute === 'register' && <RegisterForm />}
         </>
      );
   }

   return (
      <div className={cx('wrapper')}>
         <div className={cx('inner')}>{body}</div>
      </div>
   );
};

export default Auth;
