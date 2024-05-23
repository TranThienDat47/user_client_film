import classNames from 'classnames/bind';

import { useEffect, useState, useRef, memo } from 'react';
import { ListProductHome } from '~/components/ListProduct';

import styles from './AllCategoriesPage.module.scss';
import CategoriesService from '~/services/CategoriesService';
import Button from '~/components/Button';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const LENGTH_PAGE_DEFAULT = 7;

function AllCategoriesPage({ handleClickMore = () => {} }) {
   const navigate = useNavigate();

   const [listCategoriesState, setListCategoriesState] = useState([]);
   useEffect(() => {
      CategoriesService.getAll().then(async (res) => {
         const tempData = await Promise.all(
            res.categories.map(async (element, index) => {
               const tempData = await CategoriesService.getProductOfCategory({
                  catgories_id: element._id,
                  skip: 0,
                  limit: LENGTH_PAGE_DEFAULT + 1,
                  recently: true,
               }).then((res) => {
                  return res.products;
               });

               return {
                  category: element,
                  products: tempData,
               };
            }),
         );

         setListCategoriesState(tempData);
      });
   }, []);

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
                        {element.products.length > LENGTH_PAGE_DEFAULT && (
                           <div className={cx('wrapper-button')}>
                              <Button
                                 onClick={() => {
                                    handleClickMore(element.category._id);
                                    navigate('/category/' + element.category._id);
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
