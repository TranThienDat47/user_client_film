import classNames from 'classnames/bind';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { AiOutlineMenu } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import imgs from '~/assets/img';
import config from '~/config';
import styles from './HeaderSidebar.module.scss';

const cx = classNames.bind(styles);

const HeaderSidebar = forwardRef((prop, ref) => {
   const navRef = useRef();
   const pseudoRef = useRef();
   const moveNavRef = useRef(false);
   const drag = useRef(false);

   const [showNav, setShowNav] = useState(false);

   const withTempRef = useRef(0);
   const rightRef = useRef(0);
   const widthRef = useRef(0);

   const handleMouseDownNav = (e) => {
      if (e.which === 1) {
         drag.current = true;
         if (pseudoRef.current.style.display === 'none' || !pseudoRef.current.style.display) {
            pseudoRef.current.style.opacity = 0;
         }

         rightRef.current = navRef.current.getBoundingClientRect().right;
         widthRef.current = navRef.current.getBoundingClientRect().width;
         withTempRef.current = rightRef.current - e.clientX;
      }
   };

   const handleMouseMoveNav = (e) => {
      if (drag.current && e.which === 1) {
         if (!moveNavRef.current) {
            pseudoRef.current.style.display = 'block';
            navRef.current.style.transition = 'none';
            moveNavRef.current = true;
         }

         let realTranslateX = 0;

         realTranslateX = e.clientX + withTempRef.current;

         if (realTranslateX >= 240) {
            realTranslateX = 240;
         } else if (realTranslateX < 0) {
            realTranslateX = 0;
         }

         navRef.current.style.transform = `translateX(${realTranslateX - widthRef.current}px)`;
         pseudoRef.current.style.opacity = (realTranslateX / 240) * 0.4;
      }
   };

   const handleMouseUpNav = (e) => {
      if (drag.current) {
         drag.current = false;
         if (moveNavRef.current && e.which === 1) {
            const right = navRef.current.getBoundingClientRect().right;
            if (right >= (widthRef.current * 1) / 2) {
               navRef.current.style.transform = `translateX(0px)`;

               navRef.current.style.transition = '0.16s cubic-bezier(0.25, 0.35, 0, 0.25)';
               moveNavRef.current = false;
               pseudoRef.current.style.opacity = 0.4;

               setShowNav(true);
            } else if (right < (widthRef.current * 1) / 2) {
               navRef.current.style.transition = '0.2s cubic-bezier(0, 0, 0, 1)';
               navRef.current.style.transform = `translateX(-240px)`;
               moveNavRef.current = false;

               setShowNav(false);
               handleHideNav();
            }
         }
      }

      moveNavRef.current = false;
   };

   useEffect(() => {
      const temp = navRef.current;
      if (temp) temp.addEventListener('mousedown', handleMouseDownNav);
      document.addEventListener('mousemove', handleMouseMoveNav);
      document.addEventListener('mouseup', handleMouseUpNav);

      return () => {
         temp.removeEventListener('mousedown', handleMouseDownNav);
         document.removeEventListener('mousemove', handleMouseMoveNav);
         document.removeEventListener('mouseup', handleMouseUpNav);
      };
   }, [moveNavRef.current]);

   const handleShowNav = () => {
      navRef.current.style.transform = `translateX(0px)`;

      pseudoRef.current.style.display = 'block';
      pseudoRef.current.style.opacity = 0.4;
   };

   const handleHideNav = () => {
      drag.current = false;
      pseudoRef.current.style.display = 'none';
      navRef.current.style.transform = `translateX(-240px)`;
   };

   useEffect(() => {
      if (showNav) {
         handleShowNav();
      } else handleHideNav();
   }, [showNav]);

   useImperativeHandle(ref, () => ({
      showAndHide() {
         setShowNav((prev) => !prev);
      },
   }));
   const [canClickSideBarState, setCanClickSideBarState] = useState(true);

   const handleClick = () => {
      if (canClickSideBarState) {
         setShowNav((prev) => !prev);
         setCanClickSideBarState(false);
         setTimeout(() => {
            setCanClickSideBarState(true);
         }, 900);
      }
   };

   return (
      <>
         <div className={cx('nav')} ref={navRef}>
            <div className={cx('header-wrapper')}>
               <AiOutlineMenu className={cx('icon')} onClick={handleClick} />
               <Link to={config.routes.home} className={cx('logo-link')}>
                  <img src={imgs.logo} alt="Blog" />
               </Link>
            </div>
            <div className={cx('list')}>
               <div className={cx('item')}></div>
            </div>
         </div>
         <div
            className={cx('pseudo')}
            ref={pseudoRef}
            onClick={() => {
               setShowNav((prev) => !prev);
            }}
         ></div>
      </>
   );
});

export default HeaderSidebar;
