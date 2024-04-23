import { useContext, useState } from 'react';
import classNames from 'classnames/bind';

import { AuthContext } from '~/contexts/auth/AuthContext';

import imgs from '~/assets/img';
import Button from '~/components/Button';
import { FcGoogle } from 'react-icons/fc';
import { SiFacebook } from 'react-icons/si';

import styles from './Auth.module.scss';
import { Link } from 'react-router-dom';
import AuthServices from '~/services/AuthServices';
import { LOCAL_STORAGE_TOKEN_NAME, LOCAL_STORAGE_ACCOUNT_LOGIN } from '~/config/constants';

const cx = classNames.bind(styles);

const RegisterForm = () => {
   const { registerUser } = useContext(AuthContext);

   const [registerForm, setRegisterForm] = useState({
      first_name: '',
      last_name: '',
      username: '',
      password: '',
      confirm_password: '',
   });

   const [tempStep, setTempStep] = useState(0); //0 default, 1 ok email, 2 ok password
   const [invalid, setInvalid] = useState(0); //0 valid, 1 invalid duplicate email, 2 invalid password
   const [showPassword, setShowPassword] = useState(false);

   const { username, password, confirm_password, last_name, first_name } = registerForm;

   const onChangeRegisterForm = (event) => {
      setRegisterForm({ ...registerForm, [event.target.name]: event.target.value });
   };

   const hanldeChangeShowPassword = (event) => {
      setShowPassword((prev) => !prev);
   };

   const handleRegister = async (event) => {
      if (registerForm.confirm_password !== registerForm.password) {
         console.log(registerForm.confirm_password, registerForm.password);
         setInvalid(2);
         return;
      } else {
         const register = await AuthServices.register(registerForm);

         if (register.success) {
            localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, register.accessToken);
            window.location.href = '/';
         }
      }
   };

   const checkUsernameExist = async () => {
      const check = await AuthServices.checkUsername({ username: registerForm.username });

      if (check.success && check.valid) {
         setInvalid(1);
      } else {
         setTempStep(1);
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
                  <div className={cx('block-input', 'horizon-2')}>
                     <input
                        className={cx('first-name')}
                        type="text"
                        placeholder="Họ"
                        name="first_name"
                     />

                     <input
                        className={cx('last-name', 'mrg-l-13')}
                        type="text"
                        placeholder="Tên"
                        name="last_name"
                     />
                  </div>

                  <div
                     className={cx('block-input', 'mrg-t-16', `${invalid === 1 ? 'invalid' : ''}`)}
                     invalid-message={
                        invalid === 1
                           ? 'Tên đăng nhập đã được sử dụng'
                           : 'Tên đăng nhập không hợp lệ'
                     }
                  >
                     <input
                        className={cx('username')}
                        type="email"
                        placeholder="Email hoặc số điện thoại"
                        name="username"
                     />
                  </div>
               </>
            ) : (
               ''
            )}

            {tempStep === 1 ? (
               <>
                  <div className={cx('block-input')}>
                     <input
                        className={cx('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mật khẩu của bạn"
                        name="password"
                     />
                  </div>

                  <div className={cx('block-input', 'mrg-t-16')}>
                     <input
                        className={cx('password')}
                        invalid-message={
                           invalid === 1 ? 'Mật khẩu không trùng khớp' : 'Mật khẩu không trùng khớp'
                        }
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Nhập lại mật khẩu"
                        name="confirm_password"
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
               <Button to={`/login`} className={cx('btn-login')}>
                  Đã có tài khoản
               </Button>
               {tempStep === 1 ? (
                  <Button className={cx('btn-submit')} onClick={handleRegister} hover type="button">
                     Đăng ký
                  </Button>
               ) : (
                  <Button
                     className={cx('btn-submit')}
                     onClick={checkUsernameExist}
                     hover
                     type="button"
                  >
                     Tiếp theo
                  </Button>
               )}
            </div>
         </form>
         <p className={cx('separator-with_text')}>Hoặc</p>
         <div className={cx('list-login')}>
            <div>
               <Button
                  leftIcon={<FcGoogle className={cx('icon')} />}
                  large
                  href={'http://localhost:5000/api/auth/google/'}
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
