import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';

import Button from '~/components/Button';
import styles from './Follow.module.scss';
import LazyLoading from '~/components/loading/LazyLoading';
import { ListProductSearch } from '~/components/ListProduct';

import { MdOutlineSort } from 'react-icons/md';
import { IoSearchOutline } from 'react-icons/io5';
import { MdOutlineClear } from 'react-icons/md';
import { AiOutlineCheck } from 'react-icons/ai';
import { authSelector } from '~/redux/selectors/auth/authSelector';
import { useDispatch, useSelector } from 'react-redux';
import {
   beforeLoadFollowProduct,
   fetchFollowProducts,
   resetFollowProducts,
   setFollowKeySearchFromPageFollow,
   setFollowSortFromPageFollow,
} from '~/redux/slices/auth/authSlice';
import { endLoading, startLoading } from '~/utils/nprogress';
import { GlobalContext } from '~/composables/GlobalProvider';

import { Page as WrapperPage } from '~/composables/Page';
import FollowService from '~/services/FollowService';

const cx = classNames.bind(styles);

const LENGTH_PAGE_FOLLOW = 9;

const Follow = () => {
   const [isReady, setIsReady] = useState(false);

   const { setLoadFull, loadReadyPage, isReadyPage } = useContext(GlobalContext);

   const fetchInitFollowProduct = async (keySearch = '', sort = 1) => {
      if (isReadyPage) startLoading();

      try {
         const response = await FollowService.getListFollow({
            skip: 0,
            limit: LENGTH_PAGE_FOLLOW + 1,
            user_id: user._id,
            keySearch,
            sort,
         });

         if (response.success) {
            return response.follows;
         } else return [];
      } catch (err) {
         return [];
      }
   };

   const navigate = useNavigate();

   const dispatch = useDispatch();
   const { follow, user } = useSelector(authSelector);

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const search_query_page = params.get('search_query_page');

   const [initProductsFollow, setInitProductsFollow] = useState([]);

   const [sortSearchPageState, setSortSearchPageState] = useState(1);
   const [valueSearchPageState, setValueSearchPageState] = useState('');
   const [showInputClearState, setShowInputClearState] = useState(false);

   const inputSearchRef = useRef(null);
   const wrapperRef = useRef(null);
   const childRef = useRef(null);

   const [initListSortState, setInitListSortState] = useState([
      {
         id: 0,
         title: 'Ngày theo dõi (mới nhất)',
         icon: <AiOutlineCheck className={cx('sort-from-page__content-row-icon')} />,
         typeSort: 1,
         checked: true,
      },
      {
         id: 1,
         title: 'Ngày theo dõi (cũ nhất)',
         icon: <AiOutlineCheck className={cx('sort-from-page__content-row-icon')} />,
         typeSort: -1,
         checked: false,
      },
   ]);

   const handleSearch = () => {
      inputSearchRef.current.focus();
      dispatch(resetFollowProducts());

      dispatch(setFollowKeySearchFromPageFollow(valueSearchPageState));
      navigate('/follow?search_query_page=' + valueSearchPageState);
   };

   useEffect(() => {
      if (user._id) {
         fetchInitFollowProduct(search_query_page, sortSearchPageState).then((res) => {
            setInitProductsFollow(res);
         });
      }
   }, [user, sortSearchPageState]);

   useEffect(() => {
      if (user._id) {
         if (follow.keySearchFromPageFollow.trim().length <= 0) {
            navigate('/follow');
         } else {
            setValueSearchPageState(follow.keySearchFromPageFollow);
         }

         fetchInitFollowProduct(search_query_page, sortSearchPageState).then((res) => {
            setInitProductsFollow(res);
         });
      }
      return () => {
         dispatch(resetFollowProducts());
         startLoading();
      };
      // eslint-disable-next-line
   }, [search_query_page, user._id]);

   useEffect(() => {
      setTimeout(() => {
         endLoading();
         setLoadFull(true);
         loadReadyPage(true);
      });
   }, [initProductsFollow]);

   useEffect(() => {
      if (isReady && isReadyPage) {
         if (wrapperRef.current && childRef.current) {
            wrapperRef.current.onscroll = () => {
               childRef.current.handleScroll(wrapperRef.current);
            };
         }
      }
   }, [isReadyPage, isReady, childRef.current, wrapperRef.current]);

   useEffect(() => {
      if (!isReadyPage) {
         setIsReady(true);
      }

      return () => {
         dispatch(resetFollowProducts());
         loadReadyPage(false);
         setIsReady(false);
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
      if (isReady) {
         if (isReadyPage) {
            setLoadFull(true);
         }
      } else {
         setIsReady(true);
      }
   }, [
      search_query_page,
      follow,
      user,
      valueSearchPageState,
      showInputClearState,
      initProductsFollow,
   ]);

   return (
      <WrapperPage>
         <div ref={wrapperRef} className={cx('wrapper')}>
            <div className={cx('header_page')}>
               <h1 className={cx('string-formatted')}>Đang theo dõi</h1>
            </div>
            <div className={cx('inner')}>
               <div className={cx('inner__left')}>
                  {!!initProductsFollow.length ? (
                     <ListProductSearch data={initProductsFollow.slice(0, LENGTH_PAGE_FOLLOW)} />
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
                     ableLoading={!!user?._id && initProductsFollow.length > LENGTH_PAGE_FOLLOW}
                     hasMore={follow.hasMore}
                     loadingMore={follow.loadingMore}
                     pageCurrent={follow.pageFollowProduct}
                     beforeLoad={() => {
                        dispatch(beforeLoadFollowProduct());
                     }}
                     loadProductMore={(page) => {
                        dispatch(fetchFollowProducts(page));
                     }}
                  >
                     <ListProductSearch data={follow.followProduct} />
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

                                 navigate('/follow');

                                 setValueSearchPageState('');
                                 setShowInputClearState(false);

                                 dispatch(setFollowKeySearchFromPageFollow(''));
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
                                    dispatch(setFollowSortFromPageFollow(element.typeSort));
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

export default Follow;
