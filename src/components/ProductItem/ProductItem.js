import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';

import { HiOutlineDotsVertical } from 'react-icons/hi';

import images from '~/assets/img';
import styles from './ProductItem.module.scss';
import Button from '~/components/Button';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from '~/components/Popper/Menu/MenuItem';
import Headless from '../Headless';

const cx = classNames.bind(styles);

function ProductItem({
   onClick,
   extraLarge = false,
   data = { _id: '', img: '', _name: '', anotherName: '', view: '', episodes: '' },
   ...passProp
}) {
   const animationRef = useRef();
   const itemRef = useRef();
   const hoverOption = useRef(false);
   const itemWrapperRef = useRef();
   const optionRef = useRef();
   const clickOptionRef = useRef(false);
   const menuRef = useRef(null);

   const [showMenuOption, setShowMenuOption] = useState(false);
   const [optionOfset, setOptionOffset] = useState([33, 159]);

   let props = {
      onClick,
      ...passProp,
   };

   const handleMouseEnter = () => {
      if (optionRef.current && !clickOptionRef.current) {
         optionRef.current.style.display = 'block';
         hoverOption.current = true;
      }
   };

   const handleMouseOut = () => {
      if (optionRef.current && !clickOptionRef.current) {
         optionRef.current.style.display = 'none';
         hoverOption.current = false;
      }
   };

   useEffect(() => {
      itemWrapperRef.current.addEventListener('mousemove', handleMouseEnter);

      itemWrapperRef.current.addEventListener('mouseleave', handleMouseOut);
   }, []);

   useEffect(() => {
      let start = false;

      document.addEventListener('mouseup', (e) => {
         if (start && animationRef.current) {
            animationRef.current.style.transition = 'all 0.3s cubic-bezier(0.75, 1, 0.25, 0)';
            animationRef.current.style.border = '1px solid rgba(22, 24, 35, 0.6)';
            animationRef.current.style.backgroundColor = 'transparent';
            const temp = setTimeout(() => {
               if (animationRef.current)
                  animationRef.current.style.border = '1px solid rgba(22, 24, 35, 0.6)';
               clearTimeout(temp);
            }, 40);
            const temp1 = setTimeout(() => {
               if (animationRef.current)
                  animationRef.current.style.border = '1px solid rgba(22, 24, 35, 0.2)';
               clearTimeout(temp1);
            }, 80);
            const temp2 = setTimeout(() => {
               if (animationRef.current)
                  animationRef.current.style.border = '1px solid transparent';
               clearTimeout(temp2);
            }, 120);
            start = false;
         }
      });

      itemRef.current.addEventListener('dragend', (e) => {
         if (start && animationRef.current) {
            animationRef.current.style.transition = 'all 0.3s cubic-bezier(0.75, 1, 0.25, 0)';
            animationRef.current.style.border = '1px solid rgba(22, 24, 35, 0.6)';
            animationRef.current.style.backgroundColor = 'transparent';
            const temp = setTimeout(() => {
               if (animationRef.current)
                  animationRef.current.style.border = '1px solid rgba(22, 24, 35, 0.6)';
               clearTimeout(temp);
            }, 40);
            const temp1 = setTimeout(() => {
               if (animationRef.current)
                  animationRef.current.style.border = '1px solid rgba(22, 24, 35, 0.2)';
               clearTimeout(temp1);
            }, 80);
            const temp2 = setTimeout(() => {
               if (animationRef.current)
                  animationRef.current.style.border = '1px solid transparent';
               clearTimeout(temp2);
            }, 120);
            start = false;
         }
      });

      itemRef.current.addEventListener('mousedown', (e) => {
         if (e.which === 1) {
            animationRef.current.style.backgroundColor = 'rgba(22, 24, 35, 0.1)';
            animationRef.current.style.transition = '0s';
            start = true;
         }
      });
   }, []);

   const renderOptionItem = (
      items = [
         { title: 'Thêm vào danh sách yêu thích' },
         { title: 'Chia sẻ' },
         { title: 'Báo cáo vấn đề', separate: true },
      ],
   ) => {
      return items.map((item, index) => <MenuItem small key={index} data={item}></MenuItem>);
   };

   useEffect(() => {
      if (menuRef.current) {
         const element = menuRef.current;

         if (element) {
            const rect = element.getBoundingClientRect();

            if (rect.right >= window.innerWidth) {
               setOptionOffset([33, -13]);
            }

            console.log('Element position:', rect.right);
            console.log('Window position:', window.innerWidth);
         }
      }
   }, [showMenuOption]);

   const classes = cx('wrapper', {
      extraLarge,
   });

   return (
      <div ref={itemWrapperRef} className={cx('item-wrapper', { extraLarge })}>
         <Link to={`/product?id=${data._id}`} ref={itemRef} className={classes} {...props}>
            <div className={cx('wrapper-avt')}>
               <img
                  className={cx('avatar')}
                  alt="ok"
                  src={data.img || images.noImage}
                  onError={(e) => {
                     e.target.onerror = null;
                     e.target.src = images.noImage;
                  }}
               />
               {data.episodes ? (
                  <div className={cx('episode')}>
                     <span className={cx('current')}>12</span> /
                     <span className={cx('episodes')}>12</span>
                  </div>
               ) : (
                  <></>
               )}
            </div>
            <div className={cx('info-wrapper')}>
               <div className={cx('info')}>
                  <h4 className={cx('name')}>
                     <div>{data._name}</div>
                  </h4>
                  <div className={cx('productname')}>{data.anotherName}</div>
                  {!extraLarge ? (
                     <div className={cx('description')}>{data.description}</div>
                  ) : (
                     <></>
                  )}
                  <div className={cx('view')}>
                     {data.view && (
                        <>
                           <div className={cx('quantity')}>142.6N lượt xem</div>
                           {extraLarge || <span className={cx('sperator')}>|</span>}
                           <div className={cx('date')}>2 tháng trước</div>
                        </>
                     )}
                  </div>
               </div>
            </div>
         </Link>

         <div ref={optionRef} className={cx('show-option')}>
            <Headless
               visible={showMenuOption}
               offset={optionOfset}
               className={cx('option-menu')}
               onClickOutside={() => {
                  clickOptionRef.current = false;

                  optionRef.current.style.display = 'none';
                  setShowMenuOption(false);
               }}
               render={() => {
                  return (
                     <PopperWrapper ref={menuRef} className={cx('option-menu')}>
                        {renderOptionItem()}
                     </PopperWrapper>
                  );
               }}
            >
               <Button
                  className={cx('option', 'menu')}
                  transparent
                  backgroundColor="rgba(255, 255, 255, 0.94)"
                  onClick={() => {
                     clickOptionRef.current = true;
                     setShowMenuOption((prev) => !prev);
                  }}
               >
                  <HiOutlineDotsVertical />
               </Button>
            </Headless>
         </div>
         <div ref={animationRef} className={cx('animation')}></div>
      </div>
   );
}

ProductItem.propTypes = {
   to: PropTypes.string,
   small: PropTypes.bool,
   large: PropTypes.string,
   onClick: PropTypes.func,
};

export default ProductItem;
