import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';

import Button from '~/components/Button';
import styles from './SeenMovie.module.scss';
import LazyLoading from '~/components/loading/LazyLoading';
import { ListProductSearch } from '~/components/ListProduct';

import { MdOutlineSort } from 'react-icons/md';
import { IoSearchOutline } from 'react-icons/io5';
import { MdOutlineClear } from 'react-icons/md';
import { AiOutlineCheck } from 'react-icons/ai';
import { authSelector } from '~/redux/selectors/auth/authSelector';
import { useDispatch, useSelector } from 'react-redux';
import {
   beforeLoadSeenMovieProduct,
   fetchSeenMovieProducts,
   resetSeenMovieProducts,
   setSeenMovieKeySearchFromPageSeenMovie,
   setSeenMovieSortFromPageSeenMovie,
} from '~/redux/slices/auth/authSlice';
import { endLoading, startLoading } from '~/utils/nprogress';
import { GlobalContext } from '~/composables/GlobalProvider';

import { Page as WrapperPage } from '~/composables/Page';
import SeenMovieService from '~/services/SeenMovieService';

const cx = classNames.bind(styles);

const LENGTH_PAGE_FOLLOW = 9;

const SeenMovie = () => {
   const { setLoadFull, isReadyPage, loadReadyPage } = useContext(GlobalContext);

   const fetchInitSeenMovieProduct = async (keySearch = '', sort = 1) => {
      try {
         const response = await SeenMovieService.getListSeenMovie({
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

            return response.seenMovies;
         }
      } catch (err) {
         return [];
      }
   };

   const navigate = useNavigate();

   const dispatch = useDispatch();
   const { seenMovie, user } = useSelector(authSelector);

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const search_query_page = params.get('search_query_page');

   const [initProductsSeenMovie, setInitProductsSeenMovie] = useState([]);

   const [sortSearchPageState, setSortSearchPageState] = useState(1);
   const [valueSearchPageState, setValueSearchPageState] = useState('');
   const [showInputClearState, setShowInputClearState] = useState(false);

   const inputSearchRef = useRef(null);
   const wrapperRef = useRef(null);
   const childRef = useRef(null);

   const [initListSortState, setInitListSortState] = useState([
      {
         id: 0,
         title: 'Ngày xem (mới nhất)',
         icon: <AiOutlineCheck className={cx('sort-from-page__content-row-icon')} />,
         typeSort: 1,
         checked: true,
      },
      {
         id: 1,
         title: 'Ngày xem (cũ nhất)',
         icon: <AiOutlineCheck className={cx('sort-from-page__content-row-icon')} />,
         typeSort: -1,
         checked: false,
      },
   ]);

   const handleSearch = () => {
      inputSearchRef.current.focus();
      dispatch(resetSeenMovieProducts());

      dispatch(setSeenMovieKeySearchFromPageSeenMovie(valueSearchPageState));
      navigate('/seenMovie?search_query_page=' + valueSearchPageState);
   };

   useEffect(() => {
      if (user._id) {
         fetchInitSeenMovieProduct(search_query_page, sortSearchPageState).then((res) => {
            setInitProductsSeenMovie(res);
         });
      }
   }, [user, sortSearchPageState]);

   useEffect(() => {
      if (user._id) {
         if (seenMovie.keySearchFromPageSeenMovie.trim().length <= 0) {
            navigate('/seenMovie');
         } else {
            setValueSearchPageState(seenMovie.keySearchFromPageSeenMovie);
         }

         fetchInitSeenMovieProduct(search_query_page, sortSearchPageState).then((res) => {
            setInitProductsSeenMovie(res);
         });
      }
      return () => {
         dispatch(resetSeenMovieProducts());
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
         dispatch(resetSeenMovieProducts());
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
      seenMovie,
      user,
      valueSearchPageState,
      showInputClearState,
      initProductsSeenMovie,
   ]);

   return (
      <WrapperPage>
         <div ref={wrapperRef} className={cx('wrapper')}>
            <div className={cx('header_page')}>
               <h1 className={cx('string-formatted')}>Phim đã xem</h1>
            </div>
            <div className={cx('inner')}>
               <div className={cx('inner__left')}>
                  {!!initProductsSeenMovie.length ? (
                     <ListProductSearch data={initProductsSeenMovie.slice(0, LENGTH_PAGE_FOLLOW)} />
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
                     ableLoading={!!user?._id && initProductsSeenMovie.length > LENGTH_PAGE_FOLLOW}
                     hasMore={seenMovie.hasMore}
                     loadingMore={seenMovie.loadingMore}
                     pageCurrent={seenMovie.pageSeenMovieProduct}
                     beforeLoad={() => {
                        dispatch(beforeLoadSeenMovieProduct());
                     }}
                     loadProductMore={(page) => {
                        dispatch(fetchSeenMovieProducts(page));
                     }}
                  >
                     <ListProductSearch data={seenMovie.seenMovieProduct} />
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

                                 navigate('/seenMovie');

                                 setValueSearchPageState('');
                                 setShowInputClearState(false);

                                 dispatch(setSeenMovieKeySearchFromPageSeenMovie(''));
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
                                    dispatch(setSeenMovieSortFromPageSeenMovie(element.typeSort));
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

export default SeenMovie;
