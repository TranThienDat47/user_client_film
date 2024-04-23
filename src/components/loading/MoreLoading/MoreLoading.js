import { memo, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';

import styles from './MoreLoading.module.scss';
import Button from '~/components/Button';

const cx = classNames.bind(styles);

const MoreLoading = ({
   hasMore = false,
   loadingMore = false,
   pageCurrent = -1,
   beforeLoad = () => {},
   loadProductMore = () => {},
   children,
}) => {
   const btnShowMoreRef = useRef();

   useEffect(() => {
      if (pageCurrent === -1) {
         beforeLoad();
      }
   }, []);

   useEffect(() => {
      if (!loadingMore || !hasMore) return;

      loadProductMore(pageCurrent + 1);
   }, [loadingMore, hasMore]);

   useEffect(() => {
      if (btnShowMoreRef.current) {
         btnShowMoreRef.current.onclick = () => {
            beforeLoad();
         };
      }
   }, [btnShowMoreRef.current]);

   return (
      <div className={cx('wrapper')}>
         <div className="inner">{children}</div>

         {hasMore ? (
            <Button ref={btnShowMoreRef} className={cx('show-more')} hover transparent>
               hiện thêm phản hồi
            </Button>
         ) : (
            <></>
         )}
         <div className={cx('footer_pseudo')}></div>
      </div>
   );
};

export default memo(MoreLoading);
