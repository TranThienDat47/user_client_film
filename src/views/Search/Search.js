import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';

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
import { endLoading, startLoading } from '~/utils/nprogress';
import { GlobalContext } from '~/composables/GlobalProvider';

import { Page as WrapperPage } from '~/composables/Page';
import ProductServices from '~/services/ProductServices';

const cx = classNames.bind(styles);

const LENGTH_PAGE_SEARCH = 14;

const Search = () => {
   const { setLoadFull, isReadyPage, loadReadyPage } = useContext(GlobalContext);

   const dispatch = useDispatch();
   const { searchResultProducts, pageSearchResultProducts, hasMore, loadingMore, keySearch } =
      useSelector(searchPageSelector);

   const [dataInit, setDataInit] = useState([]);

   const wrapperRef = useRef(null);
   const childRef = useRef(null);

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const search_query = params.get('search_query');

   const fetchSearchInit = async () => {
      try {
         const response = await ProductServices.search({
            skip: 0,
            limit: LENGTH_PAGE_SEARCH,
            key: search_query,
         });

         if (response.success) {
            return response.products;
         } else {
            return [];
         }
      } catch (err) {
         return [];
      }
   };

   useEffect(() => {
      dispatch(setKeySearchResult(search_query));

      dispatch(resetSearchResult());

      setTimeout(() => {
         fetchSearchInit().then((res) => {
            setDataInit(res);

            endLoading();
            setLoadFull(true);
            loadReadyPage(false);
         });
      });

      return () => {
         startLoading();
      };

      // eslint-disable-next-line
   }, [search_query]);

   useEffect(() => {
      if (wrapperRef.current) {
         wrapperRef.current.onscroll = () => {
            childRef.current.handleScroll(wrapperRef.current);
         };
      }

      return () => {
         setLoadFull(false);
         loadReadyPage(false);
      };
   }, []);

   useEffect(() => {
      if (isReadyPage) {
         setLoadFull(true);
      }
   }, [
      search_query,
      dataInit,
      searchResultProducts,
      pageSearchResultProducts,
      hasMore,
      loadingMore,
      keySearch,
   ]);

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
                  <ListProductSearch data={dataInit} />

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
