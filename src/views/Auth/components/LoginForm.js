import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './Auth.module.scss';
import imgs from '~/assets/img';
import Button from '~/components/Button';

import { FcGoogle } from 'react-icons/fc';
import { SiFacebook } from 'react-icons/si';
import AuthServices from '~/services/AuthServices';

import { LOCAL_STORAGE_TOKEN_NAME, LOCAL_STORAGE_ACCOUNT_LOGIN, apiUrl } from '~/config/constants';
import { endLoading, startLoading } from '~/utils/nprogress';

const cx = classNames.bind(styles);

const LoginForm = () => {
   const [loginForm, setLoginForm] = useState({
      username: '',
      password: '',
   });

   const [tempStep, setTempStep] = useState(0); //0 default, 1 ok email, 2 ok password
   const [invalid, setInvalid] = useState(0); //0 valid, 1 invalid email, 2 invalid password
   const [showPassword, setShowPassword] = useState(false);

   // const { username, password } = loginForm;

   const onChangeLoginForm = (event) => {
      setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
   };

   const handleLogin = async (event) => {
      startLoading();
      const login = await AuthServices.loginUser(loginForm);

      if (login) {
         endLoading();
         if (login.success) {
            localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, login.accessToken);
            window.location.href = '/';
         } else {
            setInvalid(2);
         }
      }
   };

   const hanldeChangeShowPassword = (event) => {
      setShowPassword((prev) => !prev);
   };

   const checkUsernameExist = async () => {
      const check = await AuthServices.checkUsername(loginForm);

      if (check.success && check.valid) {
         setTempStep(1);
         localStorage.setItem(LOCAL_STORAGE_ACCOUNT_LOGIN, loginForm.username);
      } else {
         setInvalid(1);
         localStorage.removeItem(LOCAL_STORAGE_ACCOUNT_LOGIN);
      }
   };

   const handleChangeAccount = () => {
      setTempStep(0);
      setLoginForm({ username: '', password: '' });
      localStorage.removeItem(LOCAL_STORAGE_ACCOUNT_LOGIN);
   };

   useEffect(() => {
      if (localStorage[LOCAL_STORAGE_ACCOUNT_LOGIN]) {
         setLoginForm({
            username: localStorage[LOCAL_STORAGE_ACCOUNT_LOGIN],
            password: '',
         });

         setTempStep(1);
      }
      endLoading();
      return () => {
         startLoading();
      };
   }, []);

   return (
      <div className={cx('wrapper')}>
         <div className={cx('header')}>
            <Link to="/">
               <img className={cx('logo')} src={imgs.logo} alt="logo" />
            </Link>
            {tempStep === 0 ? <h3 className={cx('title')}>Đăng nhập với mật khẩu</h3> : ''}
            {tempStep === 1 ? (
               <>
                  <h4 className={cx('title-success')}>Chào mừng: {loginForm.username}</h4>
                  <Button onClick={handleChangeAccount} className={cx('btn-change-account')}>
                     Đổi tài khoản khác
                  </Button>
               </>
            ) : (
               ''
            )}
         </div>
         <form className={cx('frmLogin')} onChange={onChangeLoginForm}>
            {tempStep === 0 ? (
               <div
                  className={cx('block-input', `${invalid === 1 ? 'invalid' : ''}`)}
                  invalid-message={
                     invalid === 1
                        ? 'Tên đăng nhập không trùng khớp với tài khoản nào'
                        : 'Tên đăng nhập không hợp lệ'
                  }
               >
                  <input
                     className={cx('username')}
                     type="email"
                     name="username"
                     placeholder="Email"
                     onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                           e.preventDefault();
                           checkUsernameExist();
                        }
                     }}
                  />
               </div>
            ) : (
               ''
            )}

            {tempStep === 1 ? (
               <>
                  {invalid === 2 && (
                     <span
                        style={{ marginBottom: '6px', marginLeft: '6px' }}
                        className={cx('error-message')}
                     >
                        Mật khẩu sai
                     </span>
                  )}
                  <div className={cx('block-input')}>
                     <input
                        className={cx('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập mật khẩu của bạn"
                        name="password"
                        onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                              e.preventDefault();
                              handleLogin();
                           }
                        }}
                     />
                  </div>

                  <div className={cx('block-other')}>
                     <input
                        onChange={hanldeChangeShowPassword}
                        id="show-password"
                        className={cx('show-password')}
                        type="checkbox"
                     />
                     <label htmlFor="show-password" className={cx('none-selected')}>
                        Hiện mật khẩu
                     </label>
                  </div>
               </>
            ) : (
               ''
            )}

            <div className={cx('control')}>
               <Button to="/register" className={cx('btn-register')}>
                  Tạo tài khoản
               </Button>
               {tempStep === 0 ? (
                  <Button
                     type="button"
                     className={cx('btn-submit')}
                     hover
                     onClick={checkUsernameExist}
                  >
                     Tiếp theo
                  </Button>
               ) : (
                  ''
               )}
               {tempStep === 1 ? (
                  <Button type="button" className={cx('btn-submit')} hover onClick={handleLogin}>
                     Đăng nhập
                  </Button>
               ) : (
                  ''
               )}
            </div>
         </form>
         <p className={cx('separator-with_text')}>Hoặc</p>
         <div className={cx('list-login')}>
            <div>
               <Button
                  leftIcon={<FcGoogle className={cx('icon')} />}
                  large
                  href={apiUrl + '/auth/google/'}
                  className={cx('item-with', 'with-google')}
               >
                  Đăng nhập với Google
               </Button>
            </div>
            <div>
               <Button
                  leftIcon={<SiFacebook className={cx('icon')} />}
                  large
                  className={cx('item-with', 'with-facebook')}
               >
                  Đăng nhập với Facebook
               </Button>
            </div>
         </div>
      </div>
   );
};

export default LoginForm;
