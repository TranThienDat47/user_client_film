import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

import { useEffect, useState, useRef } from 'react';

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
import { useSelector } from 'react-redux';
import { authSelector } from '~/redux/selectors/auth/authSelector';

const cx = classNames.bind(styles);

function Sidebar({ collaped = false }) {
   const { user, isAuthenticated } = useSelector(authSelector);

   const currentPath = window.location.pathname;

   const dataItemCollapsed = [
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
      {
         icon: <AiOutlineBarChart className={cx('icon')} />,
         title: 'Xếp hạng',
         active: false,
         to: '#',
      },
      // {
      //    icon: <AiOutlineCheck className={cx('icon')} />,
      //    title: 'Theo dõi',
      //    active: false,
      //    to: '/follow',
      // },
      // {
      //    icon: <AiOutlineDownload className={cx('icon')} />,
      //    title: 'Đã lưu',
      //    active: false,
      //    to: '#',
      // },
   ];

   const followItemExpandRef = useRef([]);

   const [followItemExpandState, setFollowItemExpandState] = useState([]);

   const filterDataItemExpandState = (listData) => {
      var listCheck = [
         {
            icon: <AiOutlineCheck className={cx('icon')} />,
            title: 'Theo dõi',
            active: currentPath === '/follow' ? true : false,
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
            active: currentPath === '/seenMovie' ? true : false,
            to: '/seenMovie',
         },
         {
            icon: <AiOutlineDownload className={cx('icon')} />,
            title: 'Phim đã lưu',
            active: false,
            to: '#',
         },
         {
            icon: <BsClock className={cx('icon')} />,
            title: 'Xem sau',
            active: currentPath === '/seeLaterMovie' ? true : false,
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
            active: currentPath === '/' || currentPath === '' ? true : false,
            to: '/',
         },
         {
            icon: <BiCategory className={cx('icon')} />,
            title: 'Thể loại',
            active: currentPath === '/category' ? true : false,
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
            to: '#',
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
            to: '#',
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

   const [dataItemState, setDataItemState] = useState(
      collaped ? dataItemCollapsed : dataItemExpandState,
   );

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
                       to: '#',
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

            setDataItemState(
               collaped ? dataItemCollapsed : filterDataItemExpandState(tempUpdateFollowItemExpand),
            );
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

         setDataItemState(
            collaped ? dataItemCollapsed : filterDataItemExpandState(tempUpdateFollowItemExpand),
         );
      }
   };

   const wrapperRef = useRef();

   useEffect(() => {
      updateFollowList([...followItemExpandRef.current]);
   }, [currentPath]);

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
      if (collaped) {
         document.documentElement.style.setProperty('--width-default-sidebar', '75px');
         setDataItemState(dataItemCollapsed);
      } else {
         setDataItemState(dataItemExpandState);
         document.documentElement.style.setProperty('--width-default-sidebar', '240px');
      }
   }, [collaped]);

   return (
      <div ref={wrapperRef} className={cx('wrapper', collaped ? 'collaped' : '')}>
         {dataItemState.map((elment, index) => {
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
                     leftIcon={!collaped ? (!!elment.icon ? elment.icon : false) : false}
                     className={cx('button', elment.active ? 'active' : '')}
                     to={elment?.to ? elment.to : false}
                     onClick={elment?.onClick && elment.onClick}
                  >
                     {!collaped ? (
                        <div
                           className={cx('content')}
                           style={{ marginLeft: !!elment.icon ? '16px' : '0px' }}
                        >
                           <div>{elment.title}</div>
                        </div>
                     ) : (
                        <div className={cx('content')}>
                           {elment.icon}
                           <div>{elment.title}</div>
                        </div>
                     )}
                  </Button>
               );
            }
         })}
      </div>
   );
}

export default Sidebar;
