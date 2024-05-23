import classNames from 'classnames/bind';
import { useEffect, useState, useRef, memo } from 'react';

import styles from './CategoriesPage.module.scss';
import CategoriesService from '~/services/CategoriesService';
import LazyLoading from '~/components/loading/LazyLoading';
import { ListProductHome } from '~/components/ListProduct';
const cx = classNames.bind(styles);

const LENGTH_PAGE_DEFAULT = 14;

function CategoriesPage({ categoryID = null, wrapperRef }) {
   const [hasMore, setHasMore] = useState(false);
   const [loadingMore, setLoadingMore] = useState(true);
   const [pageCurrent, setPageCurrent] = useState(-1);
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
         if (res.products.length >= LENGTH_PAGE_DEFAULT) {
            setHasMore(true);
            setLoadingMore(false);
            setProductCurrent((prev) => [...prev, ...res.products]);
            setPageCurrent(page);
         } else if (res.products.length > 0 && res.products.length < LENGTH_PAGE_DEFAULT) {
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
      setPageCurrent(-1);

      beforeLoadProduct();
   }, [categoryID]);

   useEffect(() => {
      wrapperRef.current.onscroll = () => {
         childRef.current.handleScroll(wrapperRef.current);
      };
   }, []);

   return (
      <>
         <LazyLoading
            ref={childRef}
            hasMore={hasMore}
            loadingMore={loadingMore}
            pageCurrent={pageCurrent}
            beforeLoad={beforeLoadProduct}
            loadProductMore={loadProduct}
            emptyData={!!!productCurrent.length}
         >
            <ListProductHome data={!!productCurrent.length ? productCurrent : []} />
         </LazyLoading>
      </>
   );
}

export default memo(CategoriesPage);
