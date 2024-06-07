import React, { useEffect, useRef, useContext, useState } from 'react';
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
   resetHomeSuggested,
} from '~/redux/slices/products/productHomeSuggestedSlice';
import { suggestedProductsSelector } from '~/redux/selectors/products/producHomeSuggestedtSelector';
import { endLoading } from '~/utils/nprogress';
import { GlobalContext } from '~/composables/GlobalProvider';
import { Page as WrapperPage } from '~/composables/Page';
import ProductServices from '~/services/ProductServices';

const cx = classNames.bind(styles);

function Home() {
   const [isReady, setIsReady] = useState(false);

   const fetchHomeSuggestedFirst = async () => {
      try {
         const response = await ProductServices.search({
            skip: 0,
            limit: 14,
         });

         if (response.success) return response.products;
         else return response.products;
      } catch (err) {
         return [];
      }
   };

   const { setLoadFull, isLoadFull, isReadyPage, loadReadyPage } = useContext(GlobalContext);

   const dispatch = useDispatch();

   const { newProducts, loading } = useSelector(newProductsSelector);
   const { suggestedProducts, pageSuggestedProducts, hasMore, loadingMore } =
      useSelector(suggestedProductsSelector);

   const [firstProduct, setFirstProduct] = useState([]);

   const childRef = useRef(null);
   const wrapperRef = useRef();

   useEffect(() => {
      if (!loading) {
         endLoading();
         setLoadFull(true);
         loadReadyPage(true);
      }
   }, [loading]);

   useEffect(() => {
      if (isLoadFull) {
         setTimeout(() => {
            if (wrapperRef.current) {
               wrapperRef.current.onscroll = () => {
                  childRef.current.handleScroll(wrapperRef.current);
               };
            }
         });
      }
   }, [isLoadFull]);

   useEffect(() => {
      if (!isReadyPage) {
         setIsReady(true);
      }

      dispatch(fetchHomeNew());
      fetchHomeSuggestedFirst().then((res) => {
         setFirstProduct(res);
      });

      return () => {
         dispatch(resetHomeSuggested());
         loadReadyPage(false);
         setIsReady(false);
      };
   }, []);

   useEffect(() => {
      if (isReady) {
         if (isReadyPage) {
            setLoadFull(true);
         }
      } else {
         setIsReady(true);
      }
   }, [newProducts, firstProduct, suggestedProducts, pageSuggestedProducts, hasMore, loadingMore]);

   return (
      <>
         <WrapperPage>
            <div ref={wrapperRef} className={cx('wrapper')}>
               <div className={cx('inner')}>
                  <div className={cx('heading_of_block')}>
                     <span className={cx('title')}>Mới</span>
                  </div>
                  <div className={cx('wrapper_of_block', 'wrapper-product', 'new')}>
                     <ListProductHome
                        data={
                           !!newProducts && newProducts?.length > 0
                              ? newProducts
                              : Array(14).fill(0)
                        }
                     />
                  </div>
                  <div className={cx('heading_of_block')}>
                     <span className={cx('title')}>Đề xuất</span>
                  </div>
                  <div className={cx('wrapper_of_block', 'wrapper-product', 'recommend-products')}>
                     <ListProductHome
                        data={firstProduct?.length > 0 ? firstProduct : Array(14).fill(0)}
                     />

                     <LazyLoading
                        ref={childRef}
                        ableLoading={true}
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
                        <ListProductHome data={suggestedProducts} />
                     </LazyLoading>
                  </div>
               </div>
            </div>
         </WrapperPage>
      </>
   );
}

export default React.memo(Home);
