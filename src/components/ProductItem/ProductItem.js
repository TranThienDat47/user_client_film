import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';

import { HiOutlineDotsVertical } from 'react-icons/hi';

import images from '~/assets/img';
import styles from './ProductItem.module.scss';
import Button from '~/components/Button';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import MenuItem from '~/components/Popper/Menu/MenuItem';
import Headless from '../Headless';
import formatFollowCount from '~/utils/formatFollowCount';
import FollowService from '~/services/FollowService';
import { validateTime } from '~/utils/validated';
import { authSelector } from '~/redux/selectors/auth/authSelector';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

const WIDTH_MENU_OPTION = 236;

function ProductItem({
   onClick,
   extraLarge = false,
   modeSearchPage = false,
   data = {
      _id: '',
      img: '',
      _name: '',
      anotherName: '',
      view: '',
      news: false,
      episodes: '',
      follows: '',
      currentEpisodes: '??',
      createdAt: '',
   },
   ...passProp
}) {
   const { user } = useSelector(authSelector);
   const navigate = useNavigate();

   const animationRef = useRef();
   const itemRef = useRef();
   const itemWrapperRef = useRef();
   const optionRef = useRef();
   const clickOptionRef = useRef(false);
   const menuRef = useRef(null);

   const [followState, setFollowState] = useState(0);

   const [hoverMenuOption, setHoverMenuOption] = useState(false);
   const [showMenuOption, setShowMenuOption] = useState(false);
   const [optionOfset, setOptionOffset] = useState([33, 159]);

   let props = {
      onClick,
      ...passProp,
   };

   const handleMouseEnter = () => {
      if (optionRef.current && !clickOptionRef.current) {
         optionRef.current.style.display = 'block';
         setHoverMenuOption(true);
      }
   };

   const handleMouseOut = () => {
      if (optionRef.current && !clickOptionRef.current) {
         optionRef.current.style.display = 'none';
         setHoverMenuOption(false);
      }
   };

   useEffect(() => {
      itemWrapperRef.current.addEventListener('mousemove', handleMouseEnter);

      itemWrapperRef.current.addEventListener('mouseleave', handleMouseOut);
   }, []);

   // useEffect(() => {
   //    if (data?._id) {
   //       FollowService.getCountFollowOfProduct({ product_id: data._id }).then((res) => {
   //          setFollowState(res.count);
   //       });
   //    }
   // }, [data]);

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
         {
            title: 'Theo dõi',
            onClick: () => {
               if (user) {
                  setShowMenuOption(false);
               } else {
                  navigate('/login');
               }
            },
         },
         {
            title: 'Chia sẻ (Sao chép URL)',
            onClick: () => {
               navigator.clipboard.writeText(window.location.origin + '/product?id=' + data._id);

               setShowMenuOption(false);
            },
         },
         { title: 'Báo cáo vấn đề', separate: true },
      ],
   ) => {
      return items.map((item, index) => (
         <MenuItem small key={index} onClick={item.onClick} data={item}></MenuItem>
      ));
   };

   useEffect(() => {
      if (
         WIDTH_MENU_OPTION >=
         window.innerWidth - optionRef.current.getBoundingClientRect().right
      ) {
         setOptionOffset([33, -13]);
      }
   }, [hoverMenuOption]);

   const classes = cx('wrapper', {
      extraLarge,
      modeSearchPage,
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
                     <span className={cx('current')}>{data.currentEpisodes}</span>/
                     <span className={cx('episodes')}>{data.episodes}</span>
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
                     {!!data.view || (
                        <>
                           <div className={cx('quantity')}>
                              {formatFollowCount(data.follows) + ' lượt theo dõi'}
                           </div>
                           {extraLarge || <span className={cx('sperator')}>|</span>}
                           <div className={cx('date')}>
                              {(validateTime(data.createdAt).value || '') +
                                 ' ' +
                                 validateTime(data.createdAt).unit +
                                 ' trước'}
                           </div>
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
                  backgroundColor="var(--white)"
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
