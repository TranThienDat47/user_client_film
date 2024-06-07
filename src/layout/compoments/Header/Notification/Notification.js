import { forwardRef } from 'react';

import classNames from 'classnames/bind';
import { memo, useState, useEffect, useRef } from 'react';

import styles from './Notification.module.scss';
import NotificationItem from './NotificationItem';
import NotificationServices from '~/services/NotificationServices ';

import { AiOutlineBell } from 'react-icons/ai';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

const Notification = ({ user_id }) => {
   const [showNotification, setShowNotification] = useState(false);
   const [notifications, setNotifications] = useState([]);
   const [countUnreadState, setCountUnreadState] = useState(0);

   const notificationResultRef = useRef(null);

   const fetchData = async () => {
      const temp = await NotificationServices.fetchNotifications({ user_id });

      setNotifications(temp.notification);

      const listUnread = [...temp.notification].filter((element) => !element.read);

      if (!!listUnread.length) {
         await NotificationServices.readNotification({
            list_notification: listUnread.map((element) => ({
               _id: element._id,
            })),
         });
      }
   };

   const fetchCountUnread = async () => {
      const temp = await NotificationServices.countUnread({ user_id });

      setCountUnreadState(temp.count);
   };

   useEffect(() => {
      const handleClickOutside = (e) => {
         if (
            notificationResultRef.current &&
            !notificationResultRef.current.parentNode.contains(e.target)
         ) {
            setShowNotification(false);
         }
      };

      document.addEventListener('click', handleClickOutside);

      return () => {
         document.removeEventListener('click', handleClickOutside);
      };
   }, [notificationResultRef]);

   useEffect(() => {
      fetchCountUnread();
      fetchData();
   }, [showNotification]);

   return (
      <>
         <div className={cx('wrapper')}>
            <div className={cx('wrapper-icon')}>
               <Button
                  key="notification1"
                  transparent
                  className={cx('header__icon', 'tooltip')}
                  name-tooltip="Thông báo"
                  hover
                  onClick={() => {
                     setShowNotification((prev) => !prev);
                  }}
               >
                  <AiOutlineBell />
                  {+countUnreadState <= 0 ? (
                     ''
                  ) : (
                     <div className={cx('count-notification')}>
                        {+countUnreadState > 0 && +countUnreadState <= 99 ? (
                           <>{countUnreadState}</>
                        ) : (
                           <>
                              99<sub>+</sub>
                           </>
                        )}
                     </div>
                  )}
               </Button>
            </div>

            {showNotification && (
               <div ref={notificationResultRef} className={cx('wrapper-result')}>
                  <div className={cx('header')}>
                     <h4 className={cx('header-title')}>Thông báo</h4>
                  </div>
                  <div className={cx('notifications-list')}>
                     {notifications?.length > 0 ? (
                        notifications.map((element, index) => (
                           <NotificationItem key={index} data={element}></NotificationItem>
                        ))
                     ) : (
                        <div className={cx('not_item_notification')}>Chưa có thông báo nào</div>
                     )}
                  </div>
               </div>
            )}
         </div>
      </>
   );
};

export default memo(Notification);

// [ {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },]

{
   /* <Button
                           key="notification1"
                           transparent
                           className={cx('header__icon', 'notification', 'tooltip')}
                           name-tooltip="Thông báo"
                           hover
                           onClick={() => {
                              setShowNotification((prev) => !prev);
                           }}
                        >
                           <AiOutlineBell />
                        </Button>
                        {showNotification && (
                           <Notification ref={notificationResultRef} user_id={user?._id} />
                        )} */
}
