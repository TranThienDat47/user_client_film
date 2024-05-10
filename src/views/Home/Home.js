import React, { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import { ListProductHome } from '~/components/ListProduct';
import LazyLoading from '~/components/loading/LazyLoading';
import { useDispatch, useSelector } from 'react-redux';
import { newProductsSelector } from '~/redux/selectors/products/producHomeNewtSelector';
import { fetchHomeNew } from '~/redux/slices/products/productHomeNewSlice';
import {
   beforeLoadHomeSuggested,
   fetchHomeSuggested,
} from '~/redux/slices/products/productHomeSuggestedSlice';
import { suggestedProductsSelector } from '~/redux/selectors/products/producHomeSuggestedtSelector';

const cx = classNames.bind(styles);

function Home() {
   const dispatch = useDispatch();

   const newProducts = useSelector(newProductsSelector);
   const { suggestedProducts, pageSuggestedProducts, hasMore, loadingMore } =
      useSelector(suggestedProductsSelector);

   const childRef = useRef(null);
   const wrapperRef = useRef();

   useEffect(() => {
      dispatch(fetchHomeNew());
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      wrapperRef.current.onscroll = () => {
         childRef.current.handleScroll(wrapperRef.current);
      };
   }, []);

   return (
      <div ref={wrapperRef} className={cx('wrapper')}>
         <div className={cx('inner')}>
            <div className={cx('heading_of_block')}>
               <span className={cx('title')}>Mới</span>
            </div>
            <div className={cx('wrapper_of_block', 'wrapper-product', 'new')}>
               <ListProductHome data={newProducts.length > 0 ? newProducts : Array(12).fill(0)} />
            </div>

            <div className={cx('heading_of_block')}>
               <span className={cx('title')}>Đề xuất</span>
            </div>
            <div className={cx('wrapper_of_block', 'wrapper-product', 'recommend-products')}>
               <LazyLoading
                  ref={childRef}
                  hasMore={hasMore}
                  loadingMore={loadingMore}
                  pageCurrent={pageSuggestedProducts}
                  beforeLoad={() => {
                     dispatch(beforeLoadHomeSuggested());
                  }}
                  loadProductMore={(page) => {
                     dispatch(fetchHomeSuggested(page));
                  }}
               >
                  <ListProductHome
                     data={suggestedProducts.length > 0 ? suggestedProducts : Array(12).fill(0)}
                  />
               </LazyLoading>
            </div>
         </div>
      </div>
   );
}

export default React.memo(Home);
