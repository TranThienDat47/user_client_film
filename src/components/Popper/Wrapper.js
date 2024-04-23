import { forwardRef } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Popper.module.scss';

const cx = classNames.bind(styles);

const Wrapper = forwardRef(({ children, className, ...props }, ref) => {
   return (
      <div ref={ref} className={cx('wrapper', className)} {...props}>
         {children}
      </div>
   );
});

Wrapper.prototype = {
   children: PropTypes.node.isRequired,
   className: PropTypes.string,
   ref: PropTypes.ref,
};

export default Wrapper;
