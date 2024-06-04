import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';

import styles from './Categories.module.scss';
import Button from '~/components/Button';

import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md';
import CategoriesService from '~/services/CategoriesService';
import CategoriesPage from './CategoriesPage/CategoriesPage';
import AllCategoriesPage from './AllCategoriesPage/AllCategoriesPage';
import { checkIsStart, endLoading, startLoading } from '~/utils/nprogress';
import { GlobalContext } from '~/composables/GlobalProvider';

import { Page as WrapperPage } from '~/composables/Page';
import HeaderCategories from './HeaderCategories';

const cx = classNames.bind(styles);

const STEP_SCROLL_CATEGORY = 49;

const Categories = () => {
   const { setLoadFull, isReadyPage, loadReadyPage, categoriesData } = useContext(GlobalContext);

   const location = useLocation();
   const searchParams = new URLSearchParams(location.search);
   const pageParam = searchParams.get('page');
   const tempId = pageParam ? pageParam.trim() : '';

   const [tempIdState, setTempIdState] = useState(tempId);

   const wrapperRef = useRef(null);

   const [listCategoriesState, setListCategoriesState] = useState([]);
   const [listCategoriesPageState, setListCategoriesPageState] = useState([]);

   const LENGTH_PAGE_DEFAULT = 7;

   const handleScrollTop = () => {
      wrapperRef.current.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const handleLoadPageAll = async () => {
      CategoriesService.getAll().then(async (res) => {
         await Promise.all(
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
         ).then((tempData) => {
            endLoading();
            setLoadFull(true);
            loadReadyPage(true);
            setListCategoriesState(tempData);
         });
      });
   };

   const loadProductCategory = (tempId) => {
      CategoriesService.getProductOfCategory({
         catgories_id: tempId,
         skip: 0,
         limit: LENGTH_PAGE_DEFAULT,
         recently: true,
      }).then((res) => {
         setListCategoriesPageState(res.products);
         endLoading();
         setLoadFull(true);
         loadReadyPage(true);
      });
   };

   useEffect(() => {
      setTempIdState(tempId);

      if (!!!tempId) {
         handleLoadPageAll();
      } else {
         loadProductCategory(tempId);
      }

      return () => {
         startLoading();
         loadReadyPage(false);
         setLoadFull(false);
      };
   }, [tempId]);

   useEffect(() => {
      return () => {
         loadReadyPage(false);
         setLoadFull(false);
      };
   }, []);

   // useEffect(() => {
   //    if (isReadyPage) {
   //       setLoadFull(true);
   //    }
   // }, [categoriesData]);

   return (
      <WrapperPage>
         <HeaderCategories
            tempId={tempId}
            categoriesData={categoriesData}
            scrollTop={handleScrollTop}
         />
         <div ref={wrapperRef} className={cx('wrapper')}>
            <div className={cx('inner')}>
               {!!tempIdState ? (
                  <CategoriesPage
                     wrapperRef={wrapperRef}
                     categoryID={tempIdState}
                     defaultProducts={listCategoriesPageState}
                  />
               ) : (
                  <AllCategoriesPage listCategoriesState={listCategoriesState} />
               )}
               <footer className={cx('footerpage')}></footer>
            </div>
         </div>
      </WrapperPage>
   );
};

export default Categories;
