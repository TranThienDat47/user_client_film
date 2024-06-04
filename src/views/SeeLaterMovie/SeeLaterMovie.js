import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';

import Button from '~/components/Button';
import styles from './SeeLaterMovie.module.scss';
import LazyLoading from '~/components/loading/LazyLoading';
import { ListProductSearch } from '~/components/ListProduct';

import { MdOutlineSort } from 'react-icons/md';
import { IoSearchOutline } from 'react-icons/io5';
import { MdOutlineClear } from 'react-icons/md';
import { AiOutlineCheck } from 'react-icons/ai';
import { authSelector } from '~/redux/selectors/auth/authSelector';
import { useDispatch, useSelector } from 'react-redux';
import {
   beforeLoadSeeLaterMovieProduct,
   fetchSeeLaterMovieProducts,
   resetSeeLaterMovieProducts,
   setSeeLaterMovieKeySearchFromPageSeeLaterMovie,
   setSeeLaterMovieSortFromPageSeeLaterMovie,
} from '~/redux/slices/auth/authSlice';
import { endLoading, startLoading } from '~/utils/nprogress';
import { GlobalContext } from '~/composables/GlobalProvider';

import { Page as WrapperPage } from '~/composables/Page';
import SeeLaterMovieService from '~/services/SeeLaterMovieService';

const cx = classNames.bind(styles);

const LENGTH_PAGE_FOLLOW = 9;

const SeeLaterMovie = () => {
   const { setLoadFull, isReadyPage, loadReadyPage } = useContext(GlobalContext);

   const fetchInitSeeLaterMovieProduct = async (keySearch = '', sort = 1) => {
      try {
         const response = await SeeLaterMovieService.getListSeeLaterMovie({
            skip: 0,
            limit: LENGTH_PAGE_FOLLOW + 1,
            user_id: user._id,
            keySearch,
            sort,
         });

         if (response.success) {
            setTimeout(() => {
               endLoading();
               setLoadFull(true);
               loadReadyPage(true);
            });

            return response.seeLaterMovies;
         }
      } catch (err) {
         return [];
      }
   };

   const navigate = useNavigate();

   const dispatch = useDispatch();
   const { seeLaterMovie, user } = useSelector(authSelector);

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const search_query_page = params.get('search_query_page');

   const [initProductsSeeLaterMovie, setInitProductsSeeLaterMovie] = useState([]);

   const [sortSearchPageState, setSortSearchPageState] = useState(1);
   const [valueSearchPageState, setValueSearchPageState] = useState('');
   const [showInputClearState, setShowInputClearState] = useState(false);

   const inputSearchRef = useRef(null);
   const wrapperRef = useRef(null);
   const childRef = useRef(null);

   const [initListSortState, setInitListSortState] = useState([
      {
         id: 0,
         title: 'Ngày thêm (mới nhất)',
         icon: <AiOutlineCheck className={cx('sort-from-page__content-row-icon')} />,
         typeSort: 1,
         checked: true,
      },
      {
         id: 1,
         title: 'Ngày thêm (cũ nhất)',
         icon: <AiOutlineCheck className={cx('sort-from-page__content-row-icon')} />,
         typeSort: -1,
         checked: false,
      },
   ]);

   const handleSearch = () => {
      inputSearchRef.current.focus();
      dispatch(resetSeeLaterMovieProducts());

      dispatch(setSeeLaterMovieKeySearchFromPageSeeLaterMovie(valueSearchPageState));
      navigate('/seeLaterMovie?search_query_page=' + valueSearchPageState);
   };

   useEffect(() => {
      if (user._id) {
         fetchInitSeeLaterMovieProduct(search_query_page, sortSearchPageState).then((res) => {
            setInitProductsSeeLaterMovie(res);
         });
      }
   }, [user, sortSearchPageState]);

   useEffect(() => {
      if (user._id) {
         if (seeLaterMovie.keySearchFromPageSeeLaterMovie.trim().length <= 0) {
            navigate('/seeLaterMovie');
         } else {
            setValueSearchPageState(seeLaterMovie.keySearchFromPageSeeLaterMovie);
         }

         fetchInitSeeLaterMovieProduct(search_query_page, sortSearchPageState).then((res) => {
            setInitProductsSeeLaterMovie(res);
         });
      }
      return () => {
         dispatch(resetSeeLaterMovieProducts());
         startLoading();
      };
      // eslint-disable-next-line
   }, [search_query_page, user._id]);

   useEffect(() => {
      if (isReadyPage) {
         if (wrapperRef.current && childRef.current) {
            wrapperRef.current.onscroll = () => {
               childRef.current.handleScroll(wrapperRef.current);
            };
         }
      }
   }, [isReadyPage, childRef.current, wrapperRef.current]);

   useEffect(() => {
      return () => {
         setLoadFull(false);
         loadReadyPage(false);
         dispatch(resetSeeLaterMovieProducts());
      };
   }, []);

   useEffect(() => {
      if (valueSearchPageState.trim() !== '') {
         setShowInputClearState(true);
      } else {
         setShowInputClearState(false);
      }
   }, [valueSearchPageState]);

   useEffect(() => {
      if (isReadyPage) {
         setLoadFull(true);
      }
   }, [
      search_query_page,
      seeLaterMovie,
      user,
      valueSearchPageState,
      showInputClearState,
      initProductsSeeLaterMovie,
   ]);

   return (
      <WrapperPage>
         <div ref={wrapperRef} className={cx('wrapper')}>
            <div className={cx('header_page')}>
               <h1 className={cx('string-formatted')}>Xem sau</h1>
            </div>
            <div className={cx('inner')}>
               <div className={cx('inner__left')}>
                  {!!initProductsSeeLaterMovie.length ? (
                     <ListProductSearch
                        data={initProductsSeeLaterMovie.slice(0, LENGTH_PAGE_FOLLOW)}
                     />
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
                     ableLoading={
                        !!user?._id && initProductsSeeLaterMovie.length > LENGTH_PAGE_FOLLOW
                     }
                     hasMore={seeLaterMovie.hasMore}
                     loadingMore={seeLaterMovie.loadingMore}
                     pageCurrent={seeLaterMovie.pageSeeLaterMovieProduct}
                     beforeLoad={() => {
                        dispatch(beforeLoadSeeLaterMovieProduct());
                     }}
                     loadProductMore={(page) => {
                        dispatch(fetchSeeLaterMovieProducts(page));
                     }}
                  >
                     <ListProductSearch data={seeLaterMovie.seeLaterMovieProduct} />
                  </LazyLoading>
               </div>
               <div className={cx('inner__right')}>
                  <div className={cx('search-from-page__wrapper')}>
                     <div className={cx('search-from-page__inner')}>
                        <Button
                           onClick={() => {
                              handleSearch();
                           }}
                           transparent
                           hover
                           className={cx('search-from-page__inner-icon')}
                        >
                           <IoSearchOutline className={cx('search-from-page__inner-icon-main')} />
                        </Button>
                        <input
                           ref={inputSearchRef}
                           value={valueSearchPageState}
                           onChange={(e) => {
                              setValueSearchPageState(e.target.value);
                           }}
                           onKeyUp={(e) => {
                              if (e.key === 'Enter') {
                                 handleSearch();
                              }
                           }}
                           type="text"
                           placeholder="Tìm kiếm trong danh sách ..."
                           className={cx('search-from-page__inner-input')}
                        />
                        {showInputClearState && (
                           <Button
                              onClick={() => {
                                 inputSearchRef.current.focus();

                                 navigate('/seeLaterMovie');

                                 setValueSearchPageState('');
                                 setShowInputClearState(false);

                                 dispatch(setSeeLaterMovieKeySearchFromPageSeeLaterMovie(''));
                              }}
                              transparent
                              hover
                              className={cx('search-from-page__inner-icon')}
                           >
                              <MdOutlineClear style={{ color: 'var(--text-color)' }} />
                           </Button>
                        )}
                     </div>
                  </div>
                  <div className={cx('sort-from-page__wrapper')}>
                     <div className={cx('sort-from-page__inner')}>
                        <div className={cx('sort-from-page__header')}>
                           <MdOutlineSort className={cx('sort-from-page__header-icon')} />
                           <div className={cx('sort-from-page__header-text')}>Sắp xếp</div>
                        </div>
                        <div className={cx('sort-from-page__content')}>
                           {initListSortState.map((element, index) => (
                              <div
                                 key={'sort' + index}
                                 onClick={() => {
                                    setSortSearchPageState(element.typeSort);
                                    dispatch(
                                       setSeeLaterMovieSortFromPageSeeLaterMovie(element.typeSort),
                                    );
                                    setInitListSortState((prev) =>
                                       prev.map((elementTemp, indexTemp) =>
                                          indexTemp === index
                                             ? { ...elementTemp, checked: true }
                                             : { ...elementTemp, checked: false },
                                       ),
                                    );
                                 }}
                                 className={cx(
                                    'sort-from-page__content-row',
                                    element.checked && 'sort-from-page__content-row-check',
                                 )}
                              >
                                 {element.icon}
                                 {element.title}
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </WrapperPage>
   );
};

export default SeeLaterMovie;
