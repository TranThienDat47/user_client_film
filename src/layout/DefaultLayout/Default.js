import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Header from '../compoments/Header';
import styles from './Default.module.scss';
import SideBar from './Sidebar';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
   return (
      <div className={cx('wrapper')}>
         <Header />
         <div className={cx('container')}>
            <SideBar />
            <div className={cx('content')}>{children}</div>
         </div>
      </div>
   );
}

DefaultLayout.propTypes = {
   children: PropTypes.node.isRequired,
};

export default DefaultLayout;
