import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import imgs from '~/assets/img';
import Button from '~/components/Button';
import { FcGoogle } from 'react-icons/fc';
import { SiFacebook } from 'react-icons/si';
import styles from './Auth.module.scss';
import { Link } from 'react-router-dom';
import AuthServices from '~/services/AuthServices';
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from '~/config/constants';
import { endLoading, startLoading } from '~/utils/nprogress';

const cx = classNames.bind(styles);

const RegisterForm = () => {
   const [registerForm, setRegisterForm] = useState({
      first_name: '',
      last_name: '',
      username: '',
      password: '',
      confirm_password: '',
   });

   const passwordRef = useRef();

   const [tempStep, setTempStep] = useState(0);
   const [invalid, setInvalid] = useState(-1);
   const [showPassword, setShowPassword] = useState(false);

   const onChangeRegisterForm = (event) => {
      setRegisterForm({ ...registerForm, [event.target.name]: event.target.value });
   };

   const hanldeChangeShowPassword = () => {
      setShowPassword((prev) => !prev);
   };

   const handleRegister = async (event) => {
      if (!!registerForm.confirm_password && !!registerForm.password) {
         if (registerForm.password.trim().length >= 6) {
            event.preventDefault();
            startLoading();
            if (registerForm.confirm_password !== registerForm.password) {
               setInvalid(2);
               endLoading();
               return;
            } else {
               try {
                  const register = await AuthServices.register(registerForm);
                  if (register.success) {
                     localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, register.accessToken);
                     window.location.href = '/';
                     endLoading();
                  } else {
                     endLoading();
                  }
               } catch (error) {
                  endLoading();
               }
            }
         } else {
            setInvalid(4);
         }
      } else {
         setInvalid(0);
      }
   };

   useEffect(() => {
      if (tempStep === 1) {
         passwordRef.current.value = '';
      }
   }, [tempStep]);

   useEffect(() => {
      endLoading();
      return () => {
         startLoading();
      };
   }, []);

   const validateEmail = (email) => {
      const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return re.test(String(email).toLowerCase());
   };

   const checkUsernameExist = async () => {
      if (!!registerForm.username && !!registerForm.first_name && !!registerForm.last_name) {
         if (validateEmail(registerForm.username)) {
            try {
               const check = await AuthServices.checkUsername({ username: registerForm.username });
               if (check.success && !check.valid) {
                  setTempStep(1);
                  setInvalid(-1);
               } else {
                  setInvalid(1);
               }
            } catch (error) {}
         } else {
            setInvalid(3);
         }
      } else {
         setInvalid(0);
      }
   };

   return (
      <div className={cx('wrapper')}>
         <div className={cx('header')}>
            <Link to="/">
               <img className={cx('logo')} src={imgs.logo} alt="logo" />
            </Link>
            <h3 className={cx('title')}>Tạo tài khoản mới</h3>
         </div>
         <form className={cx('frmLogin')} onChange={onChangeRegisterForm}>
            {tempStep === 0 ? (
               <>
                  {invalid === 0 && (
                     <span style={{ marginBottom: '6px' }} className={cx('error-message')}>
                        Bạn phải nhập đầy đủ thông tin
                     </span>
                  )}
                  <div className={cx('block-input', 'horizon-2')}>
                     <input
                        className={cx('first-name')}
                        type="text"
                        placeholder="Họ"
                        name="first_name"
                        required
                     />
                     <input
                        className={cx('last-name', 'mrg-l-13')}
                        type="text"
                        placeholder="Tên"
                        name="last_name"
                     />
                  </div>
                  <div
                     style={{ flexDirection: 'column' }}
                     className={cx('block-input', 'mrg-t-16', { invalid: invalid === 1 })}
                  >
                     <input
                        className={cx('username')}
                        required
                        type="email"
                        placeholder="Email "
                        name="username"
                        onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                              e.preventDefault();
                              checkUsernameExist();
                           }
                        }}
                     />
                     {invalid === 1 ? (
                        <span className={cx('error-message', 'mrg-t-16')}>
                           Tên đăng nhập đã được sử dụng
                        </span>
                     ) : invalid === 3 ? (
                        <span className={cx('error-message', 'mrg-t-16')}>
                           Tên đăng nhập phải là email(ví dụ: 123@gmail.com)
                        </span>
                     ) : (
                        <></>
                     )}
                  </div>
               </>
            ) : (
               <>
                  {invalid === 0 && (
                     <span
                        style={{ marginBottom: '6px', marginLeft: '6px' }}
                        className={cx('error-message')}
                     >
                        Bạn phải nhập đầy đủ thông tin
                     </span>
                  )}

                  <div className={cx('block-input')}>
                     <input
                        className={cx('password')}
                        ref={passwordRef}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mật khẩu của bạn"
                        name="password"
                        required
                     />
                  </div>
                  {invalid === 4 && (
                     <span
                        style={{ marginTop: '6px', marginLeft: '6px' }}
                        className={cx('error-message')}
                     >
                        Độ dài mật khẩu ít nhất 6 ký tự
                     </span>
                  )}
                  <div className={cx('block-input', 'mrg-t-16')}>
                     <input
                        className={cx('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        name="confirm_password"
                        onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                              e.preventDefault();
                              handleRegister();
                           }
                        }}
                        required
                     />
                  </div>
                  {invalid === 2 && (
                     <span
                        style={{ marginTop: '6px', marginLeft: '6px' }}
                        className={cx('error-message')}
                     >
                        Mật khẩu không trùng khớp
                     </span>
                  )}
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
            )}
            <div className={cx('control')}>
               <Button to={`/login`} className={cx('btn-login')}>
                  Đã có tài khoản
               </Button>
               <Button
                  className={cx('btn-submit')}
                  onClick={tempStep === 1 ? handleRegister : checkUsernameExist}
                  hover
                  type="button"
               >
                  {tempStep === 1 ? 'Đăng ký' : 'Tiếp theo'}
               </Button>
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

export default RegisterForm;
