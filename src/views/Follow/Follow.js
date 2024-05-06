import classNames from 'classnames/bind';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect, useContext, useState, useRef } from 'react';

import Button from '~/components/Button';
import styles from './Follow.module.scss';
import LazyLoading from '~/components/loading/LazyLoading';
import { ListProductSearch } from '~/components/ListProduct';

import { AuthContext } from '~/contexts/auth';

import { MdOutlineSort } from 'react-icons/md';
import { IoSearchOutline } from 'react-icons/io5';
import { MdOutlineClear } from 'react-icons/md';
import { AiOutlineCheck } from 'react-icons/ai';

const cx = classNames.bind(styles);

const Follow = () => {
   const navigate = useNavigate();

   const {
      authState: { user, followProduct, pageFollowProducts, hasMoreFollow, loadingMoreFollow },
      beforeLoadFollowProduct,
      loadFollowProduct,
      setKeySearchFromPageFollow,
      resetFollowProducts,
      setSortFromPageFollow,
   } = useContext(AuthContext);

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
      resetFollowProducts();
      setKeySearchFromPageFollow({ keySearchFromPageFollow: valueSearchPageState });
      navigate('/follow?search_query=' + valueSearchPageState);
   };

   useEffect(() => {
      if (valueSearchPageState.trim().length <= 0) {
         navigate('/follow');
      }

      if (+pageFollowProducts === -1) {
         beforeLoadFollowProduct();
      }
   }, [search_query]);

   useEffect(() => {
      wrapperRef.current.onscroll = () => {
         childRef.current.handleScroll(wrapperRef.current);
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
                  hasMore={hasMoreFollow}
                  loadingMore={loadingMoreFollow}
                  pageCurrent={pageFollowProducts}
                  beforeLoad={beforeLoadFollowProduct}
                  loadProductMore={loadFollowProduct}
               >
                  <ListProductSearch data={followProduct} />
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

                              resetFollowProducts();
                              setKeySearchFromPageFollow({
                                 keySearchFromPageFollow: '',
                              });
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
                                 setSortFromPageFollow({ sortFromPageFollow: element.typeSort });
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

export default Follow;
