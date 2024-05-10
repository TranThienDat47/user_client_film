import classNames from 'classnames/bind';
// import { useLocation } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import Button from '~/components/Button';
import styles from './Categories.module.scss';

import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';

const cx = classNames.bind(styles);

const STEP_SCROLL_CATEGORY = 49;

const Categories = () => {
   // const navigate = useNavigate();

   // const location = useLocation();
   // const params = new URLSearchParams(location.search);

   const [dataInitCategoriesState, setDataInitCategoriesState] = useState([
      {
         id: 0,
         title: 'Nổi bật',
         active: true,
      },
      {
         id: 1,
         title: 'Hồi quy',
         active: false,
      },
      {
         id: 2,
         title: 'Siêu nhiên',
         active: false,
      },
      {
         id: 3,
         title: 'Học đường',
         active: false,
      },
      {
         id: 4,
         title: 'Tình cảm',
         active: false,
      },
   ]);

   const [showButtonCategoryState, setShowButtonCategoryState] = useState({
      showLeft: false,
      showRight: false,
   });

   const wrapperListCategoryRef = useRef(null);
   const firstItemCategoryRef = useRef(null);
   const lastItemCategoryRef = useRef(null);
   const ableScrollCategoryRef = useRef(false);

   const currentScrollRef = useRef(0);
   const prevScrollRef = useRef(0);
   const isDragRef = useRef(false);
   const beforeMoveRef = useRef(0);
   const maxMoveRef = useRef(0);
   const isMoveRef = useRef(false);

   const wrapperRef = useRef(null);
   const childRef = useRef(null);

   const handleCheckShowButton = (scrollWidth, maxMove) => {
      if (scrollWidth <= 0) {
         setShowButtonCategoryState({ showRight: true, showLeft: false });
      } else if (scrollWidth >= maxMove) {
         setShowButtonCategoryState({ showLeft: true, showRight: false });
      } else if (scrollWidth < maxMove && scrollWidth > 0) {
         setShowButtonCategoryState({ showLeft: true, showRight: true });
      }
   };

   const handlScrollRight = () => {
      currentScrollRef.current = currentScrollRef.current + STEP_SCROLL_CATEGORY;
      prevScrollRef.current = currentScrollRef.current;
      if (currentScrollRef.current >= maxMoveRef.current) {
         currentScrollRef.current = maxMoveRef.current;
      }

      wrapperListCategoryRef.current.scrollTo(currentScrollRef.current, 0);
      handleCheckShowButton(currentScrollRef.current, maxMoveRef.current);
   };

   const handlScrollLeft = () => {
      currentScrollRef.current = currentScrollRef.current - STEP_SCROLL_CATEGORY;
      prevScrollRef.current = currentScrollRef.current;

      if (currentScrollRef.current <= 0) {
         currentScrollRef.current = 0;
      }

      wrapperListCategoryRef.current.scrollTo(currentScrollRef.current, 0);
      handleCheckShowButton(currentScrollRef.current, maxMoveRef.current);
   };

   useEffect(() => {
      wrapperRef.current.onscroll = () => {
         childRef.current.handleScroll(wrapperRef.current);
      };
   }, []);

   useEffect(() => {
      const rectWapperList = wrapperListCategoryRef.current.getBoundingClientRect();
      const rectLastItem = lastItemCategoryRef.current.getBoundingClientRect();

      maxMoveRef.current = rectLastItem.right - rectWapperList.right;

      if (rectWapperList.right < rectLastItem.right) {
         setShowButtonCategoryState({ ...showButtonCategoryState, showRight: true });
         ableScrollCategoryRef.current = true;
      }

      if (ableScrollCategoryRef.current) {
         wrapperListCategoryRef.current.onmousedown = (e) => {
            if (!isDragRef.current) {
               isDragRef.current = true;
               beforeMoveRef.current = e.clientX;
            }
         };

         window.onmousemove = (e) => {
            if (isDragRef.current === true) {
               isMoveRef.current = true;
               let realTranslateX = beforeMoveRef.current - e.clientX;

               currentScrollRef.current = prevScrollRef.current + realTranslateX;

               if (currentScrollRef.current >= maxMoveRef.current) {
                  currentScrollRef.current = maxMoveRef.current;
               }

               if (currentScrollRef.current <= 0) {
                  currentScrollRef.current = 0;
               }

               wrapperListCategoryRef.current.scrollTo(currentScrollRef.current, 0);

               handleCheckShowButton(currentScrollRef.current, maxMoveRef.current);
            }
         };

         window.onmouseup = (e) => {
            if (isDragRef.current) {
               e.preventDefault();

               prevScrollRef.current = currentScrollRef.current;

               isDragRef.current = false;

               if (isMoveRef.current) {
                  setTimeout(() => {
                     isMoveRef.current = false;
                  }, 0);
               }
            }
         };
      }
      // eslint-disable-next-line
   }, [ableScrollCategoryRef.current]);

   return (
      <div ref={wrapperRef} className={cx('wrapper')}>
         <div className={cx('header_page')}>
            <h1 className={cx('string-formatted')}>Thể loại</h1>
            <div
               className={cx('wrapper-categories')}
               style={{
                  paddingLeft: showButtonCategoryState.showLeft && '46px',
                  paddingRight: showButtonCategoryState.showRight && '46px',
               }}
            >
               <div ref={wrapperListCategoryRef} className={cx('categories-list')}>
                  {dataInitCategoriesState.map((element, index) => (
                     <div
                        key={'category' + index}
                        ref={
                           index === 0
                              ? firstItemCategoryRef
                              : index === dataInitCategoriesState.length - 1
                              ? lastItemCategoryRef
                              : null
                        }
                        className={cx(
                           'categories-item',
                           element.active && 'categories-item-active',
                        )}
                        onClick={(e) => {
                           if (!isMoveRef.current) {
                              e.preventDefault();
                              setDataInitCategoriesState(
                                 dataInitCategoriesState.map((elementTemp, indexTemp) =>
                                    indexTemp === index
                                       ? { ...elementTemp, active: true }
                                       : { ...elementTemp, active: false },
                                 ),
                              );
                           }
                        }}
                     >
                        {element.title}
                     </div>
                  ))}
               </div>
               <div className={cx('control-button-categories')}>
                  {showButtonCategoryState.showLeft && (
                     <div
                        className={cx(
                           'control-button-categories__wrapper-button',
                           'control-button-categories__wrapper-button-left',
                        )}
                        onClick={handlScrollLeft}
                     >
                        <Button
                           transparent
                           hover
                           className={cx('control-button-categories__button')}
                        >
                           <MdOutlineKeyboardArrowLeft />
                        </Button>
                     </div>
                  )}
                  {showButtonCategoryState.showRight && (
                     <div
                        onClick={handlScrollRight}
                        className={cx(
                           'control-button-categories__wrapper-button',
                           'control-button-categories__wrapper-button-right',
                        )}
                     >
                        <Button
                           transparent
                           hover
                           className={cx('control-button-categories__button')}
                        >
                           <MdOutlineKeyboardArrowRight />
                        </Button>
                     </div>
                  )}
               </div>
            </div>
         </div>
         <div className={cx('inner')}></div>
      </div>
   );
};

export default Categories;
