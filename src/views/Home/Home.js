import React, { useContext, useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import { ListProductHome } from '~/components/ListProduct';
import { ProductContext } from '~/contexts/product';
import LazyLoading from '~/components/loading/LazyLoading';

const cx = classNames.bind(styles);

function Home() {
   const {
      productState: { suggestedProducts, pageSuggestedProducts, newProducts, hasMore, loadingMore },
      loadHomeSuggested,
      loadNewHome,
      beforeLoadHomeSuggested,
   } = useContext(ProductContext);

   const childRef = useRef(null);
   const wrapperRef = useRef();

   useEffect(() => {
      loadNewHome();
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
                  beforeLoad={beforeLoadHomeSuggested}
                  loadProductMore={loadHomeSuggested}
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
