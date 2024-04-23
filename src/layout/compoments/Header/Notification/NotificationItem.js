import classNames from 'classnames/bind';
import { memo } from 'react';

import styles from './Notification.module.scss';
import imgs from '~/assets/img';

const cx = classNames.bind(styles);

function NotificationItem({ data = { image: '', title: '', time: '' } }) {
   return (
      <a href="#" className={cx('notification-item')}>
         <div className={cx('notification-item__image')}>
            <img src={data.image || imgs.noImage} />
         </div>
         <div className={cx('notification-item__content')}>
            <div className={cx('notification-item__title')}>{data.title}</div>
            <div className={cx('notification-item__time')}>{data.time}</div>
         </div>
      </a>
   );
}

export default memo(NotificationItem);
