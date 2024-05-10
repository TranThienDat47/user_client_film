import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Header from '../compoments/Header';
import styles from './Default.module.scss';
import SideBar from './Sidebar';
import { useState } from 'react';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
   const [navbarCollapsedState, setNavbarCollapsedState] = useState(false);

   return (
      <div className={cx('wrapper')}>
         <Header
            collapseDefault={false}
            onCollapse={() => {
               setNavbarCollapsedState(true);
            }}
            onExpand={() => {
               setNavbarCollapsedState(false);
            }}
         />
         <div className={cx('container')}>
            <SideBar collaped={navbarCollapsedState} />
            <div className={cx('content')}>{children}</div>
         </div>
      </div>
   );
}

DefaultLayout.propTypes = {
   children: PropTypes.node.isRequired,
};

export default DefaultLayout;
