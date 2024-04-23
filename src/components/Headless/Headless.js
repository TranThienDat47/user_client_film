import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { memo, useEffect, useRef } from 'react';

import styles from './Headless.module.scss';

const cx = classNames.bind(styles);
const defaultFn = () => {};

function Headless({
   children,
   className,
   render = defaultFn,
   visible = false,
   onClick,
   onClickOutside = () => {},
   offset = [],
   ...passProp
}) {
   let props = {
      onClick,
      ...passProp,
   };
   const wrapperRef = useRef();

   const classes = cx('wrapper', {
      [className]: className,
   });

   useEffect(() => {
      function handleClickOutside(event) {
         if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            onClickOutside();
         }
      }

      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);

      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
         document.removeEventListener('touchstart', handleClickOutside);
      };
   }, [wrapperRef]);

   return (
      <div ref={wrapperRef} className={classes} {...props}>
         {children}
         {!visible || (
            <div
               style={{ top: `calc(100% + ${offset[0]}px)`, left: `${offset[1]}px` }}
               className={cx('headless')}
            >
               {render()}
            </div>
         )}
      </div>
   );
}

Headless.propTypes = {
   children: PropTypes.node.isRequired,
   onClickOutside: PropTypes.func,
};

export default memo(Headless);
