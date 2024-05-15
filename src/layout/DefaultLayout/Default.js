import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Header from '../compoments/Header';
import styles from './Default.module.scss';
import SideBar from './Sidebar';
import { useState, Suspense } from 'react';

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
            <Suspense>
               <SideBar collaped={navbarCollapsedState} />
            </Suspense>
            <Suspense>
               <div className={cx('content')}>{children}</div>
            </Suspense>
         </div>
      </div>
   );
}

DefaultLayout.propTypes = {
   children: PropTypes.node.isRequired,
};

export default DefaultLayout;
