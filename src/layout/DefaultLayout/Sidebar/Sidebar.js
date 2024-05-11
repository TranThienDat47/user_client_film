import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

import { useEffect, useState, useRef } from 'react';

import { RiSettingsLine } from 'react-icons/ri';
import {
   AiOutlineDownload,
   AiOutlineFire,
   AiOutlineBarChart,
   AiOutlineHome,
   AiOutlineCheck,
} from 'react-icons/ai';

import {
   AiOutlineLogout,
   AiOutlineExclamationCircle,
   AiOutlineQuestionCircle,
   AiOutlineThunderbolt,
   AiOutlineRight,
   AiOutlineMenu,
   AiOutlineBell,
} from 'react-icons/ai';
import { AiOutlineLike } from 'react-icons/ai';
import { BsClock } from 'react-icons/bs';
import { BsClockHistory } from 'react-icons/bs';

import { BiCategory } from 'react-icons/bi';

import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Sidebar({ collaped = false }) {
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
      {
         icon: <AiOutlineCheck className={cx('icon')} />,
         title: 'Theo dõi',
         active: false,
         to: '#',
      },
      {
         icon: <AiOutlineDownload className={cx('icon')} />,
         title: 'Đã lưu',
         active: false,
         to: '#',
      },
   ];

   const followItemExpand = [
      {
         icon: (
            <img
               className={cx('img-item')}
               src="https://i.pinimg.com/200x/95/5d/47/955d474243bdcaad4a40c9bdd6dca4a8.jpg"
            />
         ),
         title: 'Đấu la đại lục',
         active: false,
         to: '#',
      },
      {
         icon: (
            <img
               className={cx('img-item')}
               src="https://i.pinimg.com/200x/95/5d/47/955d474243bdcaad4a40c9bdd6dca4a8.jpg"
            />
         ),
         title: 'Đấu la đại lục',
         active: false,
         to: '#',
      },
      {
         icon: (
            <img
               className={cx('img-item')}
               src="https://i.pinimg.com/200x/95/5d/47/955d474243bdcaad4a40c9bdd6dca4a8.jpg"
            />
         ),
         title: 'Đấu la đại lục',
         active: false,
         to: '#',
      },
      {
         icon: (
            <img
               className={cx('img-item')}
               src="https://i.pinimg.com/200x/95/5d/47/955d474243bdcaad4a40c9bdd6dca4a8.jpg"
            />
         ),
         title: 'Đấu la đại lục',
         active: false,
         to: '#',
      },
      {
         icon: (
            <img
               className={cx('img-item')}
               src="https://i.pinimg.com/200x/95/5d/47/955d474243bdcaad4a40c9bdd6dca4a8.jpg"
            />
         ),
         title: 'Đấu la đại lục',
         active: false,
         to: '#',
      },
      {
         icon: (
            <img
               className={cx('img-item')}
               src="https://i.pinimg.com/200x/95/5d/47/955d474243bdcaad4a40c9bdd6dca4a8.jpg"
            />
         ),
         title: 'Đấu la đại lục',
         active: false,
         to: '#',
      },
   ];

   const dataItemExpand = [
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
         to: '#',
      },
      {
         icon: <AiOutlineDownload className={cx('icon')} />,
         title: 'Phim đã lưu',
         active: false,
         to: '#',
      },
      { icon: <BsClock className={cx('icon')} />, title: 'Xem sau', active: false, to: '#' },
      {
         icon: <AiOutlineLike className={cx('icon')} />,
         title: 'Phim đã thích',
         active: false,
         to: '#',
      },
      {
         icon: null,
         title: null,
         sperator: true,
         header_title: 'Theo dõi',
      },
      ...followItemExpand,
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

   const [dataItemState, setDataItemState] = useState(
      collaped ? dataItemCollapsed : dataItemExpand,
   );

   const wrapperRef = useRef();

   useEffect(() => {
      if (collaped) {
         document.documentElement.style.setProperty('--width-default-sidebar', '75px');
         setDataItemState(dataItemCollapsed);
      } else {
         setDataItemState(dataItemExpand);
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
                     leftIcon={!collaped ? elment.icon : false}
                     className={cx('button', elment.active ? 'active' : '')}
                     to={elment?.to ? elment.to : false}
                  >
                     {!collaped ? (
                        <div className={cx('content')}>
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
