import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { useEffect, useRef, useContext } from 'react';

import styles from './Search.module.scss';
import { ListProductSearch } from '~/components/ListProduct';
import LazyLoading from '~/components/loading/LazyLoading';
import { useDispatch, useSelector } from 'react-redux';
import { searchPageSelector } from '~/redux/selectors/searchs/searchPageSelector';
import {
   fetchSearchResultProducts,
   resetSearchResult,
   setKeySearchResult,
   beforeLoadSearchResult,
} from '~/redux/slices/searchs/searchPageSlice';
import { checkIsStart, endLoading } from '~/utils/nprogress';
import { GlobalContext } from '~/composables/GlobalProvider';

import { Page as WrapperPage } from '~/composables/Page';

const cx = classNames.bind(styles);

const Search = () => {
   const { setLoadFull } = useContext(GlobalContext);

   const dispatch = useDispatch();
   const { searchResultProducts, pageSearchResultProducts, hasMore, loadingMore, keySearch } =
      useSelector(searchPageSelector);

   const wrapperRef = useRef(null);
   const childRef = useRef(null);

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const search_query = params.get('search_query');

   useEffect(() => {
      dispatch(setKeySearchResult(search_query));

      dispatch(resetSearchResult());
      setTimeout(() => {
         if (keySearch.trim() !== '') {
            dispatch(beforeLoadSearchResult());
         }
      }, 10);

      // eslint-disable-next-line
   }, [search_query]);

   useEffect(() => {
      setTimeout(() => {
         endLoading();
         setLoadFull(true);

         if (wrapperRef.current) {
            wrapperRef.current.onscroll = () => {
               childRef.current.handleScroll(wrapperRef.current);
            };
         }
      });
   }, []);

   return (
      <WrapperPage>
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
                     hasMore={hasMore}
                     loadingMore={loadingMore}
                     pageCurrent={pageSearchResultProducts}
                     beforeLoad={() => {
                        dispatch(beforeLoadSearchResult());
                     }}
                     loadProductMore={(page) => {
                        dispatch(fetchSearchResultProducts(page));
                     }}
                  >
                     <ListProductSearch data={searchResultProducts} />
                  </LazyLoading>
               </div>
            </div>
         </div>
      </WrapperPage>
   );
};

export default Search;
