import { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import Button from '~/components/Button';
import styles from './Product.module.scss';
import { ProductItem } from '~/components/ProductItem';
import { Comment } from '~/components/Comment';

import imgs from '~/assets/img';

import formatFollowCount from '~/utils/formatFollowCount';

import { converterDate, converterDateTitle, sortedEpisodes } from '~/utils/validated';
import LazyLoading from '~/components/loading/LazyLoading';
import FollowService from '~/services/FollowService';
import { useDispatch, useSelector } from 'react-redux';
import { recommendProductsSelector } from '~/redux/selectors/products/producRecommendSelector';
import {
   beforeLoadProductRecommend,
   fetchRecommendProducts,
} from '~/redux/slices/products/productRecommendSlice';
import { globalSelector } from '~/redux/selectors/globals/globalSelector';
import { fetchProductCurrent } from '~/redux/slices/globals/globalSlice';
import { authSelector } from '~/redux/selectors/auth/authSelector';
import SeeLaterMovieService from '~/services/SeeLaterMovieService';
import { checkIsStart, endLoading } from '~/utils/nprogress';
import { GlobalContext } from '~/composables/GlobalProvider';

import { Page as WrapperPage } from '~/composables/Page';

const cx = classNames.bind(styles);

const Product = () => {
   const { setLoadFull } = useContext(GlobalContext);

   const navigate = useNavigate();

   const { user } = useSelector(authSelector);

   const dispatch = useDispatch();

   const { productCurrent, loading } = useSelector(globalSelector);

   const { pageRecommendProducts, hasMore, loadingMore, recommendProducts } =
      useSelector(recommendProductsSelector);

   const [seeLaterState, setSeeLaterState] = useState(false);

   const [countFollowState, setCountFollowState] = useState(false);
   const [followState, setFollowState] = useState({ isFollow: false, flagNotify: 1 }); //flag 1: notify, 0: not notify
   const [productCurrentState, setProductCurrentState] = useState({});

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const parent_id = params.get('id');

   const childRefComment = useRef(null);
   const childRefRecommend = useRef(null);
   const wrapperRef = useRef(null);
   const tempWatchRef = useRef(null);

   const handleSeeLater = async () => {
      if (user?._id) {
         SeeLaterMovieService.seeLaterMovie({ user_id: user?._id, ref_id: parent_id }).then(
            (res) => {
               setSeeLaterState(true);
            },
         );
      } else {
         navigate('/login');
      }
   };
   const handleSeeLaterAfter = async () => {
      if (user?._id) {
         SeeLaterMovieService.unseeLaterMovie({ user_id: user?._id, ref_id: parent_id }).then(
            (res) => {
               setSeeLaterState(false);
            },
         );
      } else {
         navigate('/login');
      }
   };

   const handleFollow = async () => {
      if (user?._id) {
         FollowService.follow({ user_id: user?._id, ref_id: parent_id }).then((res) => {
            setFollowState({ ...followState, isFollow: true });
            setCountFollowState((prev) => ++prev);
         });
      } else {
         navigate('/login');
      }
   };
   const handleFollowAfter = async () => {
      if (user?._id) {
         FollowService.unfollow({ user_id: user?._id, ref_id: parent_id }).then((res) => {
            setFollowState({ ...followState, isFollow: false });
            setCountFollowState((prev) => --prev);
         });
      } else {
         navigate('/login');
      }
   };

   useEffect(() => {
      if (user && parent_id) {
         FollowService.checkIsFollow({ user_id: user?._id, ref_id: parent_id }).then((res) => {
            if (res.isFollow) {
               setFollowState({ ...followState, isFollow: true });
            } else {
               setFollowState({ ...followState, isFollow: false });
            }
         });

         SeeLaterMovieService.checkIsSeeLaterMovie({ user_id: user?._id, ref_id: parent_id }).then(
            (res) => {
               if (res.isSeeLaterMovie) {
                  setSeeLaterState(true);
               } else {
                  setSeeLaterState(false);
               }
            },
         );
      }

      // eslint-disable-next-line
   }, [user, parent_id]);

   useEffect(() => {
      if (parent_id) {
         FollowService.getCountFollowOfProduct({ product_id: parent_id }).then((res) => {
            setCountFollowState(res.count);
         });
      }
   }, [parent_id]);

   useEffect(() => {
      if (!parent_id) {
         navigate('/');
      } else dispatch(fetchProductCurrent(parent_id));

      // eslint-disable-next-line
   }, [parent_id]);

   useEffect(() => {
      if (productCurrent?.product && parent_id) {
         let currentState = {};

         currentState._name = productCurrent?.product._name;
         currentState.anotherName = productCurrent?.product.anotherName;
         currentState.description = productCurrent?.product.description;
         currentState.img = productCurrent?.product.img;
         currentState.episodes = productCurrent?.product.episodes;
         currentState.currentEpisodes = productCurrent?.product.currentEpisodes;
         currentState.view = productCurrent?.product.view;
         currentState.releaseDate = converterDate(productCurrent?.product.releaseDate);
         currentState.news = productCurrent?.product.news;
         currentState.reacts = productCurrent?.product.reacts;
         currentState.categories = productCurrent?.product.reacts;
         currentState.background = productCurrent?.product.background;
         currentState.country_Of_Origin = productCurrent?.product.country_Of_Origin;
         currentState.createdAt = productCurrent?.product.createdAt;
         currentState.categories = productCurrent?.product.categories;

         setProductCurrentState(currentState);
         wrapperRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
   }, [productCurrent, parent_id]);

   useEffect(() => {
      setTimeout(() => {
         endLoading();
         setLoadFull(true);
         wrapperRef.current.onscroll = () => {
            childRefComment.current.handleScroll(wrapperRef.current);
            childRefRecommend.current.handleScroll(wrapperRef.current);
         };
      });
   }, []);

   return (
      <WrapperPage>
         <div ref={wrapperRef} className={cx('wrapper')}>
            <div className={cx('inner')}>
               <div className={cx('wrapper_of_block', 'top')}>
                  <div className={cx('top__background')}>
                     <img
                        src={
                           loading
                              ? imgs.noImage
                              : productCurrentState.background
                              ? productCurrentState.background
                              : imgs.noImage
                        }
                        alt={productCurrentState._name}
                        onError={(e) => {
                           e.target.onerror = null;
                           e.target.src = imgs.noImage;
                        }}
                     />
                     <div className={cx('background_modal')}></div>
                  </div>

                  <div className={cx('top__introduce')}>
                     <div className={cx('top__thumbnail')}>
                        <img
                           src={
                              loading
                                 ? imgs.noImage
                                 : productCurrentState.img
                                 ? productCurrentState.img
                                 : imgs.noImage
                           }
                           alt="Ko co gi"
                           onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = imgs.noImage;
                           }}
                        />
                     </div>
                     <div className={cx('top__details')}>
                        <div className={cx('top__name', 'content-empty w-200 h-29')}>
                           {productCurrentState._name}
                        </div>
                        <div className={cx('top__another-name', 'content-empty w-200 h-23')}>
                           {productCurrentState.anotherName}
                        </div>

                        <div className={cx('top__details-inf')}>
                           <div className={cx('top__details-inf__content')}>
                              <div className={cx('wrapper-count', 'count-date')}>
                                 <span>Ngày ra mắt:</span>
                                 <div
                                    className={cx(
                                       'content-empty w-100 h-20',
                                       'string-formatted',
                                       'strong',
                                    )}
                                 >
                                    {productCurrentState.releaseDate}
                                 </div>
                              </div>
                              <div className={cx('wrapper-count', 'count-episode')}>
                                 <span>Số tập:</span>
                                 <div
                                    className={cx(
                                       loading ? 'content-empty w-100 h-20' : '',
                                       'string-formatted',
                                       'strong',
                                    )}
                                 >
                                    {productCurrentState.currentEpisodes}/
                                    {productCurrentState.episodes}
                                 </div>
                              </div>
                              <div className={cx('wrapper-count', 'count-views')}>
                                 <span>Lượt theo dõi:</span>
                                 <div
                                    className={cx(
                                       'content-empty w-100 h-20',
                                       'string-formatted',
                                       'strong',
                                    )}
                                 >
                                    {!!countFollowState ? formatFollowCount(countFollowState) : 0}
                                 </div>
                              </div>
                           </div>
                           <div className={cx('others-controls')}>
                              {loading ? (
                                 ''
                              ) : (
                                 <>
                                    <Button
                                       to={tempWatchRef.current || '#'}
                                       primary
                                       rounded
                                       className={cx('btn_follow')}
                                       disable={
                                          productCurrent?.product_details &&
                                          productCurrent?.product_details.length <= 0
                                             ? true
                                             : false
                                       }
                                    >
                                       Xem phim
                                    </Button>

                                    {seeLaterState ? (
                                       <Button
                                          onClick={handleSeeLaterAfter}
                                          grey
                                          rounded
                                          className={cx('btn_follow')}
                                       >
                                          Bỏ xem sau
                                       </Button>
                                    ) : (
                                       <Button
                                          onClick={handleSeeLater}
                                          grey
                                          rounded
                                          className={cx('btn_follow')}
                                       >
                                          Xem sau
                                       </Button>
                                    )}

                                    {followState.isFollow ? (
                                       <Button
                                          onClick={handleFollowAfter}
                                          grey
                                          rounded
                                          className={cx('btn_watching')}
                                       >
                                          Bỏ theo dõi
                                       </Button>
                                    ) : (
                                       <Button
                                          onClick={handleFollow}
                                          grey
                                          rounded
                                          className={cx('btn_watching')}
                                       >
                                          Theo dõi
                                       </Button>
                                    )}
                                 </>
                              )}
                           </div>
                        </div>

                        <div className={cx('categories')}>
                           <div className={cx('categories-title')}>
                              <span>Thể loại:</span>
                           </div>
                           <div className={cx('categories-list')}>
                              {productCurrentState.categories &&
                                 productCurrentState.categories.map((element, index) => (
                                    <Link
                                       to={'/category/' + element._id}
                                       key={element._id ? element._id : index}
                                    >
                                       {element.title}
                                    </Link>
                                 ))}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
               <div className={cx('page-body')}>
                  <div className={cx('body-left')}>
                     <div>
                        <div className={cx('wrapper_of_block', 'container', 'wrapper_detail')}>
                           <div className={cx('detail')}>
                              <div className={cx('inf__header')}>
                                 {/* <span className={cx('string-formatted')}>
                              {formatFollowCount(productDetailCurrentState.views)}
                              lượt xem
                           </span> */}
                                 {/* <span className={cx('string-formatted')}> - </span> */}
                                 <span className={cx('string-formatted')}>
                                    {converterDateTitle(productCurrentState.createdAt)}
                                 </span>
                              </div>
                              <div className={cx('wrapper-count', 'description', 'mrg-b-3')}>
                                 <span className={cx('string-formatted strong flex-shink-0')}>
                                    Nội dung phim:
                                 </span>
                                 <span className={cx('string-formatted')}> </span>
                                 <div
                                    className={cx(
                                       'string-formatted',
                                       'content-empty w-100 h-20',
                                       'text-align-justify',
                                    )}
                                 >
                                    {productCurrentState.description}
                                 </div>
                              </div>

                              <div className={cx('wrapper-count', 'date', 'mrg-b-3')}>
                                 <span className={cx('string-formatted strong flex-shink-0')}>
                                    Ngày phát hành:
                                 </span>
                                 <span className={cx('string-formatted')}> </span>
                                 <div
                                    className={cx(
                                       'string-formatted',
                                       'content-empty w-100 h-20',
                                       'text-align-justify',
                                    )}
                                 >
                                    {productCurrentState.releaseDate}
                                 </div>
                              </div>

                              <div className={cx('wrapper-count', 'country', 'mrg-b-3')}>
                                 <span className={cx('string-formatted strong flex-shink-0')}>
                                    Quốc gia:
                                 </span>
                                 <span className={cx('string-formatted')}> </span>
                                 <div
                                    className={cx(
                                       'string-formatted',
                                       loading ? 'content-empty w-100 h-20' : '',
                                       'text-align-justify',
                                    )}
                                 >
                                    {productCurrentState.country_Of_Origin || ''}
                                 </div>
                              </div>

                              <div className={cx('wrapper-count', 'status', 'mrg-b-3')}>
                                 <span className={cx('string-formatted strong flex-shink-0')}>
                                    Trạng thái:
                                 </span>
                                 <span className={cx('string-formatted')}> </span>
                                 <div
                                    className={cx(
                                       'string-formatted',
                                       'content-empty w-100 h-20',
                                       'text-align-justify',
                                    )}
                                 >
                                    Đã hoàn thành
                                 </div>
                              </div>
                              <div className={cx('wrapper-count', 'episode', 'mrg-b-3')}>
                                 <span className={cx('string-formatted strong flex-shink-0')}>
                                    Số tập:
                                 </span>
                                 <span className={cx('string-formatted')}> </span>
                                 <div
                                    className={cx(
                                       'string-formatted',
                                       'content-empty w-100 h-20',
                                       'text-align-justify',
                                    )}
                                 >
                                    {productCurrentState.currentEpisodes}/
                                    {productCurrentState.episodes}
                                 </div>
                              </div>

                              <div className={cx('wrapper-count', 'categories')}>
                                 <span className={cx('string-formatted strong')}>Thể loại:</span>
                                 <span className={cx('string-formatted')}> </span>
                                 <div
                                    className={cx(
                                       'string-formatted',
                                       'content-empty w-100 h-20',
                                       'text-align-justify',
                                    )}
                                 >
                                    {productCurrentState.categories &&
                                       productCurrentState.categories.map((element, index) =>
                                          index === 0 ? element.title : ', ' + element.title,
                                       )}
                                 </div>
                              </div>

                              <div className={cx('trailer')}>
                                 <span className={cx('string-formatted strong')}>
                                    Đoạn phim giới thiệu
                                 </span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className={cx('wrapper_of_block', 'container')}>
                        <div className={cx('header-inner eposide__header')}>
                           <span className={cx('string-formatted strong')}>Chọn tập</span>
                        </div>
                        <div className={cx('list-episodes')}>
                           {productCurrent?.product_details?.length > 0 ? (
                              sortedEpisodes(productCurrent?.product_details).map(
                                 (element, index) => {
                                    if (index === productCurrent?.product_details.length - 1) {
                                       tempWatchRef.current = `/watch?parent_id=${parent_id}&episodes=${productCurrent?.product_details[index]._id}`;
                                    }

                                    return (
                                       <Link
                                          to={`/watch?parent_id=${parent_id}&episodes=${element._id}`}
                                          key={element._id}
                                          className={cx('item-episodes')}
                                       >
                                          {element.episode}
                                       </Link>
                                    );
                                 },
                              )
                           ) : (
                              <div>Hiện chưa có tập phim nào</div>
                           )}
                        </div>
                     </div>

                     <Comment key={parent_id} ref={childRefComment} parent_id={parent_id}></Comment>
                  </div>
                  <div className={cx('body-right')}>
                     <div className={cx('heading_of_block')}>
                        <h3 className={cx('title')}>Đề xuất</h3>
                     </div>
                     <div className={cx('sperator')}></div>
                     <div className={cx('wrapper_of_block', 'container', 'no-margin-top')}>
                        <div className={cx('recommend')}>
                           <LazyLoading
                              ref={childRefRecommend}
                              hasMore={hasMore}
                              loadingMore={loadingMore}
                              pageCurrent={pageRecommendProducts}
                              beforeLoad={() => {
                                 dispatch(beforeLoadProductRecommend());
                              }}
                              loadProductMore={(page) => {
                                 dispatch(fetchRecommendProducts(page));
                              }}
                           >
                              {recommendProducts.map((element, index) => (
                                 <div key={index} className={cx('productTest')}>
                                    <ProductItem key={index} data={element}></ProductItem>
                                 </div>
                              ))}
                           </LazyLoading>
                        </div>
                     </div>
                  </div>
               </div>

               <div className={cx('footer_pseudo')}></div>
            </div>
         </div>
      </WrapperPage>
   );
};

export default Product;
