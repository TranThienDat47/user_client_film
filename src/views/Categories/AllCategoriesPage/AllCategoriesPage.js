import classNames from 'classnames/bind';

import { useEffect, useState, useRef, memo } from 'react';
import { ListProductHome } from '~/components/ListProduct';

import styles from './AllCategoriesPage.module.scss';
import CategoriesService from '~/services/CategoriesService';
import Button from '~/components/Button';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const LENGTH_PAGE_DEFAULT = 7;

function AllCategoriesPage({ handleClickMore = () => {}, listCategoriesState }) {
   const navigate = useNavigate();

   return (
      <>
         <div className={cx('wrapper')}>
            {listCategoriesState.map((element, index) =>
               !!element.products.length ? (
                  <div key={'allcategorypage' + index} className={cx('wrapper-category')}>
                     <h3>{element.category.title}</h3>
                     <div className={cx('content')}>
                        <ListProductHome data={element.products.slice(0, 7)} />
                     </div>

                     <div className={cx('footer')}>
                        <div className={cx('sperator')}></div>
                        {element.products.length > LENGTH_PAGE_DEFAULT + 1 && (
                           <div className={cx('wrapper-button')}>
                              <Button
                                 onClick={() => {
                                    handleClickMore(element.category._id);
                                    navigate('/category?page=' + element.category._id);
                                 }}
                                 rounded
                                 transparent
                                 className={cx('button-view')}
                              >
                                 Xem toàn bộ
                              </Button>
                           </div>
                        )}
                     </div>
                  </div>
               ) : (
                  <div key={'allcategorypage' + index}></div>
               ),
            )}
         </div>
      </>
   );
}

export default memo(AllCategoriesPage);
