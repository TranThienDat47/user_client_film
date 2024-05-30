import classNames from 'classnames/bind';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import imgs from '~/assets/img';
import config from '~/config';
import styles from './HeaderSidebar.module.scss';
import { useSelector } from 'react-redux';
import { authSelector } from '~/redux/selectors/auth/authSelector';

import { RiSettingsLine } from 'react-icons/ri';
import {
   AiOutlineDownload,
   AiOutlineBarChart,
   AiOutlineHome,
   AiOutlineCheck,
} from 'react-icons/ai';

import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { AiOutlineLike } from 'react-icons/ai';
import { BsClock } from 'react-icons/bs';
import { BsClockHistory } from 'react-icons/bs';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

import { BiCategory } from 'react-icons/bi';

import Button from '~/components/Button';
import FollowService from '~/services/FollowService';

const cx = classNames.bind(styles);

const HeaderSidebar = forwardRef((prop, ref) => {
   const { user, isAuthenticated } = useSelector(authSelector);

   const navRef = useRef();
   const pseudoRef = useRef();
   const moveNavRef = useRef(false);
   const drag = useRef(false);

   const followItemExpandRef = useRef([]);
   const [followItemExpandState, setFollowItemExpandState] = useState([]);

   const filterDataItemExpandState = (listData) => {
      var listCheck = [
         {
            icon: <AiOutlineCheck className={cx('icon')} />,
            title: 'Theo dõi',
            active: false,
            to: '/follow',
         },
         {
            icon: null,
            title: null,
            sperator: true,
            header_title: 'Cá nhân',
         },
         {
            icon: <BsClockHistory className={cx('icon')} />,
            title: 'Phim đã xem',
            active: false,
            to: '/seenMovie',
         },
         {
            icon: <AiOutlineDownload className={cx('icon')} />,
            title: 'Phim đã lưu',
            active: false,
            to: false,
         },
         {
            icon: <BsClock className={cx('icon')} />,
            title: 'Xem sau',
            active: false,
            to: '/seeLaterMovie',
         },
         ...listData,
      ];

      if (!isAuthenticated) {
         listCheck = [];
      }

      return [
         {
            icon: <AiOutlineHome className={cx('icon')} />,
            title: 'Trang chủ',
            active: false,
            to: '/',
         },
         {
            icon: <BiCategory className={cx('icon')} />,
            title: 'Thể loại',
            active: false,
            to: '/category',
         },
         ...listCheck,
         {
            icon: null,
            title: null,
            sperator: true,
            header_title: 'Khám phá',
         },
         {
            icon: <AiOutlineBarChart className={cx('icon')} />,
            title: 'Xếp hạng',
            active: false,
            to: false,
         },
         {
            icon: null,
            title: null,
            sperator: true,
            header_title: '',
         },
         {
            icon: <RiSettingsLine className={cx('icon')} />,
            title: 'Cài đặt',
            active: false,
            to: user ? '#' : '/login',
         },
         {
            icon: <AiOutlineQuestionCircle className={cx('icon')} />,
            title: 'Trợ giúp',
            active: false,
            to: '#',
         },
      ];
   };

   const [dataItemExpandState, setDataItemExpandState] = useState(
      filterDataItemExpandState(followItemExpandState),
   );

   const updateFollowList = (followList, showMore = false) => {
      followItemExpandRef.current = followList;

      const beforeArray = [...followList];

      if (!showMore) {
         if (followList > 7) beforeArray.pop();
         else {
            const tempUpdateFollowItemExpand = [
               {
                  icon: null,
                  title: null,
                  sperator: true,
                  header_title: 'Theo dõi',
               },
            ].concat(
               beforeArray.length <= 0
                  ? {
                       icon: false,
                       title: 'Chưa theo dõi bộ phim nào',
                       active: false,
                       to: false,
                    }
                  : beforeArray
                       .map((element) => ({
                          icon: (
                             <div className={cx('wrapper-img-item')}>
                                <img className={cx('img-item')} src={element.img} />
                             </div>
                          ),
                          title: element._name,
                          active: false,
                          to: '/product?id=' + element.ref_id,
                       }))
                       .concat(
                          beforeArray.length >= 7
                             ? {
                                  icon: <IoIosArrowDown className={cx('icon')} />,
                                  title: 'Xem thêm',
                                  active: false,
                                  onClick: handleShowMoreFollow,
                                  to: '#',
                               }
                             : [],
                       ),
            );

            setFollowItemExpandState(tempUpdateFollowItemExpand);

            setDataItemExpandState(filterDataItemExpandState(tempUpdateFollowItemExpand));
         }
      } else {
         const tempUpdateFollowItemExpand = [
            {
               icon: null,
               title: null,
               sperator: true,
               header_title: 'Theo dõi',
            },
         ].concat(
            beforeArray
               .map((element) => ({
                  icon: (
                     <div className={cx('wrapper-img-item')}>
                        <img className={cx('img-item')} src={element.img} />
                     </div>
                  ),
                  title: element._name,
                  active: false,
                  to: '/product?id=' + element.ref_id,
               }))
               .concat({
                  icon: <IoIosArrowUp className={cx('icon')} />,
                  title: 'Thu gọn',
                  active: false,
                  onClick: handleCollapseFollowList,
                  to: '#',
               }),
         );

         setFollowItemExpandState(tempUpdateFollowItemExpand);

         setDataItemExpandState(filterDataItemExpandState(tempUpdateFollowItemExpand));
      }
   };

   const handleShowMoreFollow = () => {
      if (isAuthenticated) {
         FollowService.getListFollow({
            skip: 8,
            limit: 13,
            user_id: user?._id,
            keySearch: '',
            sort: 1,
         }).then((res) => {
            updateFollowList([...followItemExpandRef.current, ...res.follows], true);
         });
      }
   };

   const handleCollapseFollowList = () => {
      if (isAuthenticated) {
         FollowService.getListFollow({
            skip: 0,
            limit: 8,
            user_id: user?._id,
            keySearch: '',
            sort: 1,
         }).then((res) => {
            updateFollowList(res.follows);
         });
      }
   };

   const [showNav, setShowNav] = useState(false);

   const withTempRef = useRef(0);
   const rightRef = useRef(0);
   const widthRef = useRef(0);

   const handleMouseDownNav = (e) => {
      if (e.which === 1) {
         drag.current = true;
         if (pseudoRef.current.style.display === 'none' || !pseudoRef.current.style.display) {
            pseudoRef.current.style.opacity = 0;
         }

         rightRef.current = navRef.current.getBoundingClientRect().right;
         widthRef.current = navRef.current.getBoundingClientRect().width;
         withTempRef.current = rightRef.current - e.clientX;
      }
   };

   const handleMouseMoveNav = (e) => {
      if (drag.current && e.which === 1) {
         if (!moveNavRef.current) {
            pseudoRef.current.style.display = 'block';
            navRef.current.style.transition = 'none';
            moveNavRef.current = true;
         }

         let realTranslateX = 0;

         realTranslateX = e.clientX + withTempRef.current;

         if (realTranslateX >= 240) {
            realTranslateX = 240;
         } else if (realTranslateX < 0) {
            realTranslateX = 0;
         }

         navRef.current.style.transform = `translateX(${realTranslateX - widthRef.current}px)`;
         pseudoRef.current.style.opacity = (realTranslateX / 240) * 0.4;
      }
   };

   const handleMouseUpNav = (e) => {
      if (drag.current) {
         drag.current = false;
         if (moveNavRef.current && e.which === 1) {
            const right = navRef.current.getBoundingClientRect().right;
            if (right >= (widthRef.current * 1) / 2) {
               navRef.current.style.transform = `translateX(0px)`;

               navRef.current.style.transition = '0.16s cubic-bezier(0.25, 0.35, 0, 0.25)';
               moveNavRef.current = false;
               pseudoRef.current.style.opacity = 0.4;

               setShowNav(true);
            } else if (right < (widthRef.current * 1) / 2) {
               navRef.current.style.transition = '0.2s cubic-bezier(0, 0, 0, 1)';
               navRef.current.style.transform = `translateX(-240px)`;
               moveNavRef.current = false;

               setShowNav(false);
               handleHideNav();
            }
         }
      }

      moveNavRef.current = false;
   };

   useEffect(() => {
      const temp = navRef.current;
      if (temp) temp.addEventListener('mousedown', handleMouseDownNav);
      document.addEventListener('mousemove', handleMouseMoveNav);
      document.addEventListener('mouseup', handleMouseUpNav);

      return () => {
         temp.removeEventListener('mousedown', handleMouseDownNav);
         document.removeEventListener('mousemove', handleMouseMoveNav);
         document.removeEventListener('mouseup', handleMouseUpNav);
      };
   }, [moveNavRef.current]);

   const handleShowNav = () => {
      navRef.current.style.transform = `translateX(0px)`;

      pseudoRef.current.style.display = 'block';
      pseudoRef.current.style.opacity = 0.4;
   };

   const handleHideNav = () => {
      drag.current = false;
      pseudoRef.current.style.display = 'none';
      navRef.current.style.transform = `translateX(-240px)`;
   };

   // useEffect(() => {
   //    updateFollowList([...followItemExpandRef.current]);
   // }, [currentPath]);

   useEffect(() => {
      if (isAuthenticated) {
         FollowService.getListFollow({
            skip: 0,
            limit: 8,
            user_id: user?._id,
            keySearch: '',
            sort: 1,
         }).then((res) => {
            updateFollowList(res.follows);
         });
      }
   }, [isAuthenticated]);

   useEffect(() => {
      if (showNav) {
         handleShowNav();
      } else handleHideNav();
   }, [showNav]);

   useImperativeHandle(ref, () => ({
      showAndHide() {
         setShowNav((prev) => !prev);
      },
   }));
   const [canClickSideBarState, setCanClickSideBarState] = useState(true);

   const handleClick = () => {
      if (canClickSideBarState) {
         setShowNav((prev) => !prev);
         setCanClickSideBarState(false);
         setTimeout(() => {
            setCanClickSideBarState(true);
         }, 900);
      }
   };

   return (
      <>
         <div className={cx('nav')} ref={navRef}>
            <div className={cx('header-wrapper')}>
               <AiOutlineMenu className={cx('icon')} onClick={handleClick} />
               <Link to={config.routes.home} className={cx('logo-link')}>
                  <img src={imgs.logo} alt="Blog" />
               </Link>
            </div>
            <div className={cx('list')}>
               {dataItemExpandState.map((elment, index) => {
                  if (elment?.sperator) {
                     return (
                        <div key={'sperator' + index} className={cx('wrapper-sperator')}>
                           <div className={cx('sperator')}></div>
                           <div className={cx('header-title')}>{elment?.header_title}</div>
                        </div>
                     );
                  } else {
                     return (
                        <Button
                           transparent
                           key={'item' + index}
                           leftIcon={!!elment.icon ? elment.icon : false}
                           className={cx('button', elment.active ? 'active' : '')}
                           to={elment?.to ? elment.to : '#'}
                           onClick={elment?.onClick && elment.onClick}
                        >
                           <div
                              className={cx('content')}
                              style={{ marginLeft: !!elment.icon ? '16px' : '0px' }}
                           >
                              <div>{elment.title}</div>
                           </div>
                        </Button>
                     );
                  }
               })}
            </div>
         </div>
         <div
            className={cx('pseudo')}
            ref={pseudoRef}
            onClick={() => {
               setShowNav((prev) => !prev);
            }}
         ></div>
      </>
   );
});

export default HeaderSidebar;
