import { memo, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import classNames from 'classnames/bind';

import styles from './LadyLoading.module.scss';

const cx = classNames.bind(styles);

const LazyLoading = forwardRef(
   (
      {
         ableLoading = true,
         hasMore = false,
         loadingMore = false,
         pageCurrent = -1,
         beforeLoad = () => {},
         loadProductMore = () => {},
         loadingComponent = '',
         emptyData = false,
         children,
      },
      ref,
   ) => {
      useEffect(() => {
         if (pageCurrent === -1) beforeLoad();
      }, [pageCurrent]);

      useEffect(() => {
         if (!loadingMore || !hasMore || !ableLoading) return;

         loadProductMore(pageCurrent + 1);
      }, [loadingMore, hasMore, ableLoading, pageCurrent]);

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
               <>
                  {emptyData && (
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
                  )}
               </>
            )}
            <div className={cx('footer_pseudo')}></div>
         </div>
      );
   },
);

export default memo(LazyLoading);
