import { memo, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import classNames from 'classnames/bind';

import styles from './LadyLoading.module.scss';

const cx = classNames.bind(styles);

const LazyLoading = forwardRef(
   (
      {
         hasMore = false,
         loadingMore = false,
         pageCurrent = -1,
         beforeLoad = () => {},
         loadProductMore = () => {},
         loadingComponent = '',
         children,
      },
      ref,
   ) => {
      useEffect(() => {
         if (pageCurrent === -1) beforeLoad();
      }, []);

      useEffect(() => {
         if (!loadingMore || !hasMore) return;

         loadProductMore(pageCurrent + 1);
      }, [loadingMore, hasMore]);

      useImperativeHandle(ref, () => ({
         handleScroll(parentNode) {
            if (
               parentNode &&
               Math.floor(parentNode.offsetHeight + parentNode.scrollTop) >=
                  parentNode.scrollHeight - 3
            ) {
               if (hasMore) beforeLoad();
            }
         },
      }));

      return (
         <div className={cx('wrapper')} ref={ref}>
            <div className="inner">{children}</div>

            {loadingMore ? (
               loadingComponent || (
                  <div className={cx('loading-more')}>Đang tải thêm dữ liệu...</div>
               )
            ) : (
               <></>
            )}
            <div className={cx('footer_pseudo')}></div>
         </div>
      );
   },
);

export default memo(LazyLoading);
