import classNames from 'classnames/bind';
import { memo } from 'react';

import styles from './Notification.module.scss';
import imgs from '~/assets/img';
import { converterDateTitle, validateTime } from '~/utils/validated';
import formatContentNotify from '~/utils/formatContentNotify';

const cx = classNames.bind(styles);

function NotificationItem({ data = { image: '', content: '', createdAt: '' } }) {
   return (
      <a href="#" className={cx('notification-item')}>
         <div className={cx('notification-item__image')}>
            <img src={data.image || imgs.noImage} />
         </div>
         <div className={cx('notification-item__content')}>
            <div className={cx('notification-item__title')}>
               {formatContentNotify(data.content)}
            </div>
            <div className={cx('notification-item__time')}>
               {(validateTime(data.createdAt).value || '') +
                  ' ' +
                  validateTime(data.createdAt).unit}
            </div>
         </div>
      </a>
   );
}

export default memo(NotificationItem);
