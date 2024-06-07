import { useEffect, useState, useRef, memo } from 'react';

import CategoriesService from '~/services/CategoriesService';
import LazyLoading from '~/components/loading/LazyLoading';
import { ListProductHome } from '~/components/ListProduct';

const LENGTH_PAGE_DEFAULT = 14;

function CategoriesPage({ categoryID = null, wrapperRef, defaultProducts = [] }) {
   const [hasMore, setHasMore] = useState(false);
   const [loadingMore, setLoadingMore] = useState(true);
   const [pageCurrent, setPageCurrent] = useState(0);
   const [productCurrent, setProductCurrent] = useState(-1);

   const childRef = useRef(null);

   const beforeLoadProduct = () => {
      setHasMore(true);
      setLoadingMore(true);
   };
   const loadProduct = (page) => {
      CategoriesService.getProductOfCategory({
         catgories_id: categoryID,
         skip: page * LENGTH_PAGE_DEFAULT,
         limit: LENGTH_PAGE_DEFAULT,
         recently: true,
      }).then((res) => {
         if (res.products?.length >= LENGTH_PAGE_DEFAULT) {
            setHasMore(true);
            setLoadingMore(false);
            setProductCurrent((prev) => [...prev, ...res.products]);
            setPageCurrent(page);
         } else if (res.products?.length > 0 && res.products.length < LENGTH_PAGE_DEFAULT) {
            setHasMore(false);
            setLoadingMore(false);
            setProductCurrent((prev) => [...prev, ...res.products]);
            setPageCurrent(page);
         } else if (res.products.length <= 0) {
            setHasMore(false);
            setLoadingMore(false);
            setProductCurrent((prev) => [...prev, ...res.products]);
            setPageCurrent(page - 1);
         }
      });
   };

   useEffect(() => {
      setHasMore(false);
      setLoadingMore(false);
      setProductCurrent([]);
      setPageCurrent(0);
   }, [categoryID]);

   useEffect(() => {
      if (wrapperRef.current)
         wrapperRef.current.onscroll = () => {
            childRef.current.handleScroll(wrapperRef.current);
         };
   }, [wrapperRef.current]);

   return (
      <div style={{ width: '100%' }}>
         {defaultProducts?.length > 0 ? (
            <ListProductHome data={!!defaultProducts.length ? defaultProducts : []} />
         ) : (
            <>
               <div
                  style={{
                     color: 'var(--text-bland)',
                     fontSize: '1.6rem',
                     fontWeight: '550',
                     margin: '3px 0 0 16px',
                  }}
               >
                  Chưa có dữ liệu nào
               </div>
            </>
         )}

         <LazyLoading
            ref={childRef}
            hasMore={hasMore}
            loadingMore={loadingMore}
            pageCurrent={pageCurrent}
            beforeLoad={beforeLoadProduct}
            loadProductMore={loadProduct}
         >
            <ListProductHome data={!!productCurrent.length ? productCurrent : []} />
         </LazyLoading>
      </div>
   );
}

export default memo(CategoriesPage);
