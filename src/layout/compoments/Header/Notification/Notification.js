import { forwardRef } from 'react';

import classNames from 'classnames/bind';
import { memo, useState, useEffect } from 'react';

import styles from './Notification.module.scss';
import NotificationItem from './NotificationItem';
import NotificationServices from '~/services/NotificationServices ';

const cx = classNames.bind(styles);

const Notification = forwardRef(({ user_id }, ref) => {
   const [notifications, setNotifications] = useState([]);

   const fetchData = async () => {
      const temp = await NotificationServices.fetchNotifications({ user_id });
      setNotifications(temp.notification);
   };

   useEffect(() => {
      fetchData();
   }, []);

   return (
      <div ref={ref} className={cx('wrapper')}>
         <div className={cx('header')}>
            <h4 className={cx('header-title')}>Thông báo</h4>
         </div>
         <div className={cx('notifications-list')}>
            {notifications.length > 0 ? (
               notifications.map((element, index) => (
                  <NotificationItem key={index} data={element}></NotificationItem>
               ))
            ) : (
               <div className={cx('not_item_notification')}>Chưa có thông báo nào</div>
            )}
         </div>
      </div>
   );
});

export default memo(Notification);

// [ {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },
// {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },
// {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },
// {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },
// {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },
// {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },
// {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },
// {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },
// {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },
// {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },
// {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },
// {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },
// {
//    image: 'https://hhtq.vip/wp-content/uploads/2021/09/thieu-nien-ca-hanh-phan-2-1-1.jpg',
//    title: 'Ai đó đã thích bình luận của bạn: Phim hay quá',
//    time: 'Vừa xong',
// },]
