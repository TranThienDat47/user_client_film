import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { forwardRef, useEffect, useRef } from 'react';

const cx = classNames.bind(styles);

const Button = forwardRef(
   (
      {
         to,
         href,
         className,
         leftIcon,
         rightIcon,
         transparent = false,
         normal = false,
         grey = false,
         primary = false,
         outline = false,
         disable = false,
         rounded = false,
         text = false,
         small = false,
         hover = false,
         large = false,
         children,
         onClick,
         backgroundColor,
         ...passProp
      },
      ref,
   ) => {
      const animationRef = useRef();
      const itemRef = useRef();
      let Comp = 'button';
      let props = {
         onClick,
         ...passProp,
      };
      if (disable) {
         Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') delete props[key];
         });
      }

      if (to) {
         props.to = to;
         Comp = Link;
      } else if (href) {
         props.href = href;
         Comp = 'a';
      }

      useEffect(() => {
         let start = false,
            time0,
            time1,
            time2;

         const handleAnimation = (e) => {
            if (start && animationRef.current) {
               animationRef.current.style.transition = 'all 0.3s cubic-bezier(0.75, 1, 0.25, 0)';
               animationRef.current.style.border = '1px solid rgba(22, 24, 35, 0.4)';

               time0 = setTimeout(() => {
                  if (animationRef.current) {
                     animationRef.current.style.border = '1px solid rgba(22, 24, 35, 0.3)';
                     animationRef.current.style.backgroundColor = 'transparent';
                  }
                  clearTimeout(time0);
               }, 40);

               time1 = setTimeout(() => {
                  if (animationRef.current) {
                     animationRef.current.style.border = '1px solid rgba(22, 24, 35, 0.1)';
                  }
                  clearTimeout(time1);
               }, 80);

               time2 = setTimeout(() => {
                  if (animationRef.current)
                     animationRef.current.style.border = '1px solid transparent';
                  clearTimeout(time2);
               }, 120);

               start = false;
            }
         };

         window.addEventListener('mouseup', handleAnimation);

         itemRef.current.addEventListener('mousedown', (e) => {
            if (e.which === 1) {
               if (animationRef.current) {
                  animationRef.current.style.backgroundColor = 'rgba(22, 24, 35, 0.1)';
                  animationRef.current.style.transition = '0s';
               }
               start = true;
            }
         });

         return () => {
            window.removeEventListener('mouseup', handleAnimation);
         };
      }, []);

      const classes = cx('wrapper', {
         [className]: className,
         leftIcon,
         rightIcon,
         primary,
         grey,
         outline,
         text,
         small,
         large,
         normal,
         disable,
         rounded,
         transparent,
         hover,
      });

      return (
         <div ref={ref}>
            <Comp
               ref={itemRef}
               className={classes}
               style={{ backgroundColor: backgroundColor }}
               {...props}
            >
               {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
               <div className={cx('title')}>{children}</div>
               {rightIcon && <span className={cx('icon', 'right')}>{rightIcon}</span>}
               {!transparent || <div ref={animationRef} className={cx('animation')}></div>}
            </Comp>
         </div>
      );
   },
);

Button.propTypes = {
   to: PropTypes.string,
   href: PropTypes.string,
   className: PropTypes.string,
   leftIcon: PropTypes.node,
   rightIcon: PropTypes.node,
   primary: PropTypes.bool,
   grey: PropTypes.bool,
   outline: PropTypes.bool,
   disable: PropTypes.bool,
   rounded: PropTypes.bool,
   hover: PropTypes.bool,
   transparent: PropTypes.bool,
   text: PropTypes.bool,
   small: PropTypes.bool,
   large: PropTypes.bool,
   normal: PropTypes.bool,
   children: PropTypes.node.isRequired,
   onClick: PropTypes.func,
};

export default Button;
