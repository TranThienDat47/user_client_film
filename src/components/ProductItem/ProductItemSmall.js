import { memo, useRef } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import images from '~/assets/img';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import styles from './ProductItemSmall.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

function ProductItemSmall({
   data = {
      _id: '',
      img: '',
      _name: '',
      anotherName: '',
      view: '',
      episodes: '',
      typeKeySearch: false,
   },
   onClick,
   small = false,
   medium = true,
   active = false,
   hover = false,
   loading = false,
   ...passProp
}) {
   const itemRef = useRef();

   let props = {
      onClick,
      ...passProp,
   };

   const classes = cx('wrapper', {
      small,
      medium,
   });

   return (
      <div
         className={cx(
            'item-wrapper',
            loading ? `fetchLoading` : '',
            data.typeKeySearch ? `typeKeySearch` : '',
            {
               small,
               medium,
               active,
               hover,
            },
         )}
      >
         <Link
            to={
               data.typeKeySearch
                  ? `/search?search_query=${data._name || ''}`
                  : `/product?id=${data._id || ''}`
            }
            ref={itemRef}
            className={classes}
            {...props}
         >
            <img
               className={cx('avatar')}
               alt="ok"
               src={data.img || images.noImage}
               onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src = images.noImage;
               }}
            />
            <div className={cx('info-wrapper')}>
               <div className={cx('info')}>
                  <h4 className={cx('name')}>
                     <div>{data._name}</div>
                  </h4>
                  {!small || <div className={cx('productname')}>{data.anotherName}</div>}
                  {small || (
                     <div className={cx('view')}>
                        {data.view && (
                           <>
                              <span className={cx('quantity')}>{data.view}</span>
                              lượt xem
                           </>
                        )}
                     </div>
                  )}
                  <div className={cx('episode')}>
                     {data.episodes ||
                        <span className={cx('current')}>0</span> /
                        <span className={cx('episodes')}>{data.episodes}</span> ||
                        ''}
                  </div>
               </div>
            </div>
         </Link>

         {small || !active || <span className={cx('active')}></span>}

         {small || (
            <Button transparent className={cx('option')}>
               <HiOutlineDotsVertical />
            </Button>
         )}
         {small || (
            <Button transparent className={cx('option', 'clear')}>
               <RiDeleteBin6Line />
            </Button>
         )}
      </div>
   );
}

ProductItemSmall.propTypes = {
   small: PropTypes.bool,
   medium: PropTypes.bool,
   onClick: PropTypes.func,
};
export default memo(ProductItemSmall);
