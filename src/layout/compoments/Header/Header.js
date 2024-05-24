import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import classNames from 'classnames/bind';
import { BiUserCircle } from 'react-icons/bi';
import {
   AiOutlineLogout,
   AiOutlineExclamationCircle,
   AiOutlineQuestionCircle,
   AiOutlineThunderbolt,
   AiOutlineRight,
   AiOutlineCheck,
   AiOutlineMenu,
} from 'react-icons/ai';
import { IoLanguageOutline } from 'react-icons/io5';
import { RiSettingsLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';

import config from '~/config';
import imgs from '~/assets/img';
import Button from '~/components/Button';
import styles from './Header.module.scss';
import HeaderSidebar from './HeaderSidebar';
import Notification from './Notification';
import Menu from '~/components/Popper/Menu';
import { authSelector } from '~/redux/selectors/auth/authSelector';
import { handleChangeModeTheme } from '~/utils/handleChangeModeTheme';

const SearchLayzy = lazy(() => import('~/components/Search'));

const cx = classNames.bind(styles);

function Header({ collapseDefault = false, onCollapse = () => {}, onExpand = () => {} }) {
   const { user, isAuthenticated } = useSelector(authSelector);
   const currentPath = window.location.pathname;
   const isWatchPage = currentPath === '/watch';

   const [ableHeaderSidebarState, setAbleHeaderSidebarState] = useState(false);
   const [canClickSideBarState, setCanClickSideBarState] = useState(true);
   const [navbarCollapsedState, setNavbarCollapsedState] = useState(collapseDefault);

   // Thêm trạng thái cho giao diện và ngôn ngữ
   const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
   const [language, setLanguage] = useState('Tiếng Việt (VN)');

   const [dataInit, setDataInit] = useState(getInitialData(theme, language));

   const childRef = useRef(null);

   useEffect(() => {
      localStorage.setItem('theme', theme);
      handleChangeModeTheme(theme);
   }, [theme]);

   useEffect(() => {
      setAbleHeaderSidebarState(isWatchPage);
   }, [currentPath]);

   useEffect(() => {
      if (user) {
         setDataInit(getUserData(user, theme, language));
      } else {
         setDataInit(getInitialData(theme, language));
      }
   }, [user, theme, language]);

   function getInitialData(theme, language) {
      return [
         {
            title: <div className={cx('title')}>Cài đặt</div>,
            left_icon: <RiSettingsLine className={cx('icon')} />,
            right_icon: <AiOutlineRight className={cx('icon')} />,
         },
         {
            title: (
               <div className={cx('title')}>
                  Giao diện: Giao diện {theme === 'light' ? 'sáng' : 'tối'}
               </div>
            ),
            left_icon: <AiOutlineThunderbolt className={cx('icon')} />,
            right_icon: <AiOutlineRight className={cx('icon')} />,
            children: {
               title: <div className={cx('title')}>Giao diện</div>,
               data: [
                  {
                     title: <div className={cx('title')}>Giao diện sáng</div>,
                     left_icon:
                        theme === 'light' ? (
                           <AiOutlineCheck className={cx('icon')} />
                        ) : (
                           <div className={cx('icon')}></div>
                        ),
                     onChange: () => setTheme('light'),
                  },
                  {
                     title: <div className={cx('title')}>Giao diện tối</div>,
                     left_icon:
                        theme === 'dark' ? (
                           <AiOutlineCheck className={cx('icon')} />
                        ) : (
                           <div className={cx('icon')}></div>
                        ),
                     onChange: () => setTheme('dark'),
                  },
               ],
            },
            separate: true,
         },
         {
            title: <div className={cx('title')}>Ngôn ngữ: {language}</div>,
            left_icon: <IoLanguageOutline className={cx('icon')} />,
            right_icon: <AiOutlineRight className={cx('icon')} />,
            children: {
               title: <div className={cx('title')}>Ngôn ngữ</div>,
               data: [
                  {
                     title: <div className={cx('title')}>Tiếng Việt (VN)</div>,
                     left_icon:
                        language === 'Tiếng Việt (VN)' ? (
                           <AiOutlineCheck className={cx('icon')} />
                        ) : (
                           <div className={cx('icon')}></div>
                        ),
                     onChange: () => setLanguage('Tiếng Việt (VN)'),
                  },
               ],
            },
         },
         {
            title: <div className={cx('title')}>Trợ giúp</div>,
            left_icon: <AiOutlineQuestionCircle className={cx('icon')} />,
            separate: true,
         },
         {
            title: <div className={cx('title')}>Đóng góp ý kiến</div>,
            left_icon: <AiOutlineExclamationCircle className={cx('icon')} />,
         },
      ];
   }

   function getUserData(user, theme, language) {
      return [
         {
            title: (
               <div className={cx('title')}>
                  <p className={cx('account-name')}>{user._name}</p>
                  <p className={cx('account-email')}>{user.username}</p>
               </div>
            ),
            left_icon: (
               <img
                  className={cx('avt', 'account-avt')}
                  src={user.img || imgs.noImage}
                  onError={(e) => {
                     e.target.onerror = null;
                     e.target.src = imgs.noImage;
                  }}
                  alt=""
               />
            ),
         },
         {
            title: <div className={cx('title')}>Tài khoản của bạn</div>,
            left_icon: <BiUserCircle className={cx('icon')} />,
            separate: true,
         },
         {
            title: <div className={cx('title')}>Cài đặt</div>,
            left_icon: <RiSettingsLine className={cx('icon')} />,
            right_icon: <AiOutlineRight className={cx('icon')} />,
         },
         {
            title: (
               <div className={cx('title')}>
                  Giao diện: Giao diện {theme === 'light' ? 'sáng' : 'tối'}
               </div>
            ),
            left_icon: <AiOutlineThunderbolt className={cx('icon')} />,
            right_icon: <AiOutlineRight className={cx('icon')} />,
            children: {
               title: <div className={cx('title')}>Giao diện</div>,
               data: [
                  {
                     title: <div className={cx('title')}>Giao diện sáng</div>,
                     left_icon:
                        theme === 'light' ? (
                           <AiOutlineCheck className={cx('icon')} />
                        ) : (
                           <div className={cx('icon')}></div>
                        ),
                     onChange: () => setTheme('light'),
                  },
                  {
                     title: <div className={cx('title')}>Giao diện tối</div>,
                     left_icon:
                        theme === 'dark' ? (
                           <AiOutlineCheck className={cx('icon')} />
                        ) : (
                           <div className={cx('icon')}></div>
                        ),
                     onChange: () => setTheme('dark'),
                  },
               ],
            },
            separate: true,
         },
         {
            title: <div className={cx('title')}>Ngôn ngữ: {language}</div>,
            left_icon: <IoLanguageOutline className={cx('icon')} />,
            right_icon: <AiOutlineRight className={cx('icon')} />,
            children: {
               title: <div className={cx('title')}>Ngôn ngữ</div>,
               data: [
                  {
                     title: <div className={cx('title')}>Tiếng Việt (VN)</div>,
                     left_icon:
                        language === 'Tiếng Việt (VN)' ? (
                           <AiOutlineCheck className={cx('icon')} />
                        ) : (
                           <div className={cx('icon')}></div>
                        ),
                     onChange: () => setLanguage('Tiếng Việt (VN)'),
                  },
               ],
            },
         },
         {
            to: '/logout',
            title: <div className={cx('title')}>Đăng xuất</div>,
            left_icon: <AiOutlineLogout className={cx('icon')} />,
            separate: true,
         },
         {
            title: <div className={cx('title')}>Trợ giúp</div>,
            left_icon: <AiOutlineQuestionCircle className={cx('icon')} />,
            separate: true,
         },
         {
            title: <div className={cx('title')}>Đóng góp ý kiến</div>,
            left_icon: <AiOutlineExclamationCircle className={cx('icon')} />,
         },
      ];
   }

   const handleClickMenuSidebar = () => {
      if (ableHeaderSidebarState) {
         if (canClickSideBarState) {
            childRef.current.showAndHide();
            setCanClickSideBarState(false); // Đặt cờ là false để ngăn người dùng click trong 1 giây
            setTimeout(() => {
               setCanClickSideBarState(true); // Đặt lại cờ sau 1 giây
            }, 900);
         }
      } else {
         if (navbarCollapsedState) {
            onExpand();
            setNavbarCollapsedState(false);
         } else {
            onCollapse();
            setNavbarCollapsedState(true);
         }
      }
   };

   return (
      <>
         <header className={cx('wrapper')}>
            <div className={cx('nav')}>
               <AiOutlineMenu className={cx('nav-icon')} onClick={handleClickMenuSidebar} />
               <a href={config.routes.home} className={cx('logo-link')}>
                  <img src={imgs.logo} alt="Blog" />
               </a>
            </div>

            <div className={cx('search')}>
               <Suspense fallback={<div></div>}>
                  <SearchLayzy />
               </Suspense>
            </div>

            <div className={cx('infor')}>
               <div className={cx('infor-icon')}>
                  {isAuthenticated ? (
                     <>
                        <Notification user_id={user?._id} />
                     </>
                  ) : (
                     <>
                        <Button
                           key="login1"
                           to="/login"
                           className={cx('header__icon', 'login', 'tooltip')}
                           name-tooltip="Đăng nhập"
                           leftIcon={<BiUserCircle />}
                           rounded
                        >
                           <p>Đăng nhập</p>
                        </Button>
                     </>
                  )}
               </div>
               <div className={cx('infor-icon')}>
                  {isAuthenticated && user ? (
                     <Menu
                        placement={'bottom-start'}
                        items={dataInit}
                        key={dataInit}
                        hideOnClick={true}
                        className={cx('wrapper-account')}
                     >
                        <button className={cx('user')}>
                           <img
                              src={user.img || imgs.noImage}
                              onError={(e) => {
                                 e.target.onerror = null;
                                 e.target.src = imgs.noImage;
                              }}
                              alt="Logo"
                              className={cx('avt')}
                           />
                        </button>
                     </Menu>
                  ) : (
                     <Menu
                        placement={'bottom-start'}
                        items={dataInit}
                        key={dataInit}
                        hideOnClick={true}
                        className={cx('wrapper-account')}
                     >
                        <Button
                           key="setting1"
                           className={cx('header__icon', 'option', 'menu', 'tooltip')}
                           transparent
                           name-tooltip="Cài đặt"
                           backgroundColor="var(--white)"
                        >
                           <RiSettingsLine />
                        </Button>
                     </Menu>
                  )}
               </div>
            </div>
         </header>
         {ableHeaderSidebarState && <HeaderSidebar ref={childRef} />}
      </>
   );
}

export default Header;
