import classNames from 'classnames/bind';
import styles from './Sidebar.module.scss';

import {
   AiOutlineDownload,
   AiOutlineFire,
   AiOutlineBarChart,
   AiOutlineHome,
   AiOutlineCheck,
} from 'react-icons/ai';
import { BiCategory } from 'react-icons/bi';

import Button from '~/components/Button';

const cx = classNames.bind(styles);

function Sidebar() {
   const dataInit = [
      { icon: AiOutlineHome, title: 'Trang chủ' },
      { icon: BiCategory, title: 'Thể loại' },
      { icon: AiOutlineBarChart, title: 'Xếp hạng' },
      { icon: AiOutlineFire, title: 'Thịnh hành' },
      { icon: AiOutlineCheck, title: 'Theo dõi' },
      { icon: AiOutlineDownload, title: 'Đã lưu' },
   ];

   return (
      <div className={cx('wrapper')}>
         {dataInit.map((elment, index) => (
            <Button transparent key={index} className={cx('button')}>
               <div className={cx('content')}>
                  <elment.icon className={cx('icon')} />
                  <div>{elment.title}</div>
               </div>
            </Button>
         ))}
      </div>
   );
}

export default Sidebar;
