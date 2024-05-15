import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

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

const cx = classNames.bind(styles);

const SeeLaterMovie = () => {
   const navigate = useNavigate();

   const dispatch = useDispatch();
   const { seeLaterMovie, user } = useSelector(authSelector);

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const search_query = params.get('search_query');

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
      navigate('/seeLaterMovie?search_query=' + valueSearchPageState);
   };

   useEffect(() => {
      if (seeLaterMovie.keySearchFromPageSeeLaterMovie.trim().length <= 0) {
         navigate('/seeLaterMovie');
      } else {
         setValueSearchPageState(seeLaterMovie.keySearchFromPageSeeLaterMovie);
      }

      if (+seeLaterMovie.pageSeeLaterMovieProduct === -1) {
         dispatch(beforeLoadSeeLaterMovieProduct());
      }
      // eslint-disable-next-line
   }, [search_query]);

   useEffect(() => {
      wrapperRef.current.onscroll = () => {
         childRef.current.handleScroll(wrapperRef.current);
      };

      return () => {
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

   return (
      <div ref={wrapperRef} className={cx('wrapper')}>
         <div className={cx('header_page')}>
            <h1 className={cx('string-formatted')}>Đang theo dõi</h1>
         </div>
         <div className={cx('inner')}>
            <div className={cx('inner__left')}>
               <LazyLoading
                  ref={childRef}
                  ableLoading={!!user?._id}
                  hasMore={seeLaterMovie.hasMore}
                  loadingMore={seeLaterMovie.loadingMore}
                  pageCurrent={seeLaterMovie.pageSeeLaterMovieProduct}
                  beforeLoad={() => {
                     dispatch(beforeLoadSeeLaterMovieProduct());
                  }}
                  loadProductMore={(page) => {
                     dispatch(fetchSeeLaterMovieProducts(page));
                  }}
                  emptyData={!!!seeLaterMovie.seeLaterMovieProduct.length}
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
                              setValueSearchPageState('');
                              setShowInputClearState(false);

                              dispatch(resetSeeLaterMovieProducts());

                              dispatch(setSeeLaterMovieKeySearchFromPageSeeLaterMovie(''));

                              dispatch(beforeLoadSeeLaterMovieProduct());
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
   );
};

export default SeeLaterMovie;
