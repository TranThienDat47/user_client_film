import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { useEffect, useContext, useRef } from 'react';

import styles from './Search.module.scss';
import { ListProductSearch } from '~/components/ListProduct';
import { ProductContext } from '~/contexts/product';
import LazyLoading from '~/components/loading/LazyLoading';

const cx = classNames.bind(styles);

const Search = () => {
   const {
      productState: {
         searchResultProducts,
         pageSearchResultProducts,
         hasMoreSearch,
         loadingMoreSearch,
         keySearch,
      },
      beforeLoadSearchResult,
      loadSearchResult,
      loadKeySearch,
      resetSearchResult,
   } = useContext(ProductContext);

   const wrapperRef = useRef(null);
   const childRef = useRef(null);

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const search_query = params.get('search_query');

   useEffect(() => {
      loadKeySearch(search_query);

      resetSearchResult();
      setTimeout(() => {
         if (keySearch.trim() !== '') {
            beforeLoadSearchResult();
         }
      }, 10);
   }, [search_query]);

   useEffect(() => {
      wrapperRef.current.onscroll = () => {
         childRef.current.handleScroll(wrapperRef.current);
      };
   }, []);

   return (
      <div ref={wrapperRef} className={cx('wrapper')}>
         <div className={cx('inner')}>
            <div className={cx('header')}>
               <p className={cx('string-formatted')}>
                  Kết quả tìm kiếm cho từ khóa: "
                  <span className={cx('string-formatted strong')}>{search_query}</span>"
               </p>
            </div>
            <div className={cx('result')}>
               <LazyLoading
                  ref={childRef}
                  hasMore={hasMoreSearch}
                  loadingMore={loadingMoreSearch}
                  pageCurrent={pageSearchResultProducts}
                  beforeLoad={beforeLoadSearchResult}
                  loadProductMore={loadSearchResult}
               >
                  <ListProductSearch data={searchResultProducts} />
               </LazyLoading>
            </div>
         </div>
      </div>
   );
};

export default Search;
