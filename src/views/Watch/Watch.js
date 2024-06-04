import { useState, useEffect, useRef, useContext } from 'react';
import Button from '~/components/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Comment } from '~/components/Comment';

import classNames from 'classnames/bind';
import styles from './Watch.module.scss';

import Video from '~/components/Video/index';
import { converterDate, converterDateTitle, sortedEpisodes } from '~/utils/validated';
import LazyLoading from '~/components/loading/LazyLoading';

import { MdOutlinePlaylistAdd } from 'react-icons/md';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';

import { RiShareForwardLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { recommendProductsSelector } from '~/redux/selectors/products/producRecommendSelector';
import {
   beforeLoadProductRecommend,
   fetchRecommendProducts,
} from '~/redux/slices/products/productRecommendSlice';
import { ProductItem } from '~/components/ProductItem';
import { globalSelector } from '~/redux/selectors/globals/globalSelector';
import { fetchProductCurrent } from '~/redux/slices/globals/globalSlice';
import SeenMovieService from '~/services/SeenMovieService';
import { authSelector } from '~/redux/selectors/auth/authSelector';
import CommentServices from '~/services/CommentServices';
import formatFollowCount from '~/utils/formatFollowCount';
import ProductServices from '~/services/ProductServices';
import ShareFacebook from './components/ShareFacebook';
import { checkIsStart, endLoading } from '~/utils/nprogress';
import { GlobalContext } from '~/composables/GlobalProvider';

import { Page as WrapperPage } from '~/composables/Page';

const cx = classNames.bind(styles);

const Watch = () => {
   const dispatch = useDispatch();

   const { setLoadFull, isReadyPage, loadReadyPage } = useContext(GlobalContext);

   const { user } = useSelector(authSelector);

   const { productCurrent, loading } = useSelector(globalSelector);

   const { pageRecommendProducts, hasMore, loadingMore, recommendProducts } =
      useSelector(recommendProductsSelector);

   const navigate = useNavigate();

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const parent_id = params.get('parent_id');
   const episodeCurrent = params.get('episodes');

   const [videoInfoState, setVideoInfoState] = useState({
      videoID: '',
      listVideoSrc: [{ videoSrc: '', quality: '' }],
   });

   const inputClipboardRef = useRef(null);
   const [valueUrlState, setValueUrlState] = useState(window.location.href);
   const [showShareState, setShowShareState] = useState(false);

   const [likeState, setLikeState] = useState(false);
   const [countLikeState, setCountLikeState] = useState(0);

   const [productCurrentState, setProductCurrentState] = useState({});
   const [productDetailCurrentState, setProductDetailCurrentState] = useState({ reacts: 0 });
   const wrapperRef = useRef(null);
   const childRef = useRef(null);
   const childRefRecommend = useRef(null);
   const tempDetailRef = useRef({ _id: null, episode: null });

   const handleclipboard = (value) => {
      if (inputClipboardRef.current) {
         inputClipboardRef.current.select();
         inputClipboardRef.current.setSelectionRange(0, inputClipboardRef.current.value.length);

         navigator.clipboard.writeText(inputClipboardRef.current.value);
      }
   };

   useEffect(() => {
      dispatch(fetchProductCurrent(parent_id));
      // eslint-disable-next-line
   }, [parent_id]);

   useEffect(() => {
      if (!parent_id || !episodeCurrent) {
         navigate(`/`);
      }
      // eslint-disable-next-line
   }, []);

   useEffect(() => {
      if (productCurrent.product_details && productCurrent.product_details.length > 0) {
         const tempDetail = sortedEpisodes(productCurrent.product_details).find(
            (element, index) => element._id === episodeCurrent,
         );

         tempDetailRef.current = {
            _id: tempDetail?._id,
            episode: tempDetail?.episode,
            views: tempDetail.views,
         };
         setProductDetailCurrentState({
            _id: tempDetail?._id,
            episode: tempDetail?.episode,
            videoRef: tempDetail.video_ref,
            views: tempDetail.views,
            reacts: tempDetail.reacts,
         });

         setCountLikeState(tempDetail.reacts);
      }
      if (wrapperRef.current) wrapperRef.current.scrollTo({ top: 0, behavior: 'smooth' });
   }, [productCurrent, episodeCurrent]);

   useEffect(() => {
      if (productCurrent.product) {
         let currentState = {};

         currentState._name = productCurrent.product._name;
         currentState.anotherName = productCurrent.product.anotherName;
         currentState.description = productCurrent.product.description;
         currentState.img = productCurrent.product.img;
         currentState.episodes = productCurrent.product.episodes;
         currentState.currentEpisodes = productCurrent.product.currentEpisodes;
         currentState.views = productCurrent.product.views;
         currentState.releaseDate = converterDate(productCurrent.product.releaseDate);
         currentState.news = productCurrent.product.news;
         currentState.reacts = productCurrent.product.reacts;
         currentState.categories = productCurrent.product.reacts;
         currentState.background = productCurrent.product.background;
         currentState.country_Of_Origin = productCurrent.product.country_Of_Origin;
         currentState.createdAt = productCurrent.product.createdAt;
         currentState.categories = productCurrent.product.categories;

         setProductCurrentState(currentState);

         setTimeout(() => {
            endLoading();
            setLoadFull(true);
            loadReadyPage(true);

            if (wrapperRef.current) {
               wrapperRef.current.onscroll = () => {
                  childRef.current?.handleScroll(wrapperRef.current);
                  childRefRecommend.current?.handleScroll(wrapperRef.current);
               };
            }
         });
      }

      if (
         tempDetailRef.current?._id !== null &&
         productCurrent.product &&
         tempDetailRef.current?._id !== episodeCurrent
      ) {
         navigate(`/product?id=${parent_id}`);
      }

      // eslint-disable-next-line
   }, [productCurrent, parent_id]);

   useEffect(() => {
      if (productCurrent.product && user?._id) {
         SeenMovieService.seenMovie({ user_id: user?._id, ref_id: productCurrent.product._id });
      }
   }, [productCurrent]);

   useEffect(() => {
      if (productDetailCurrentState.videoRef) {
         setVideoInfoState({
            videoID: productDetailCurrentState._id,
            listVideoSrc: productDetailCurrentState?.videoRef
               .map((element) => ({
                  videoSrc: element._id,
                  quality: element.quality,
               }))
               .sort((a, b) => parseInt(b.quality) - parseInt(a.quality)),
         });

         if (user?._id) {
            ProductServices.checkUserLike({
               product_id: productDetailCurrentState._id,
               user_id: user?._id,
            }).then((res) => {
               if (res.isLike) setLikeState(true);
               else setLikeState(false);
            });
         }
      }
   }, [productDetailCurrentState]);

   useEffect(() => {
      if (productDetailCurrentState.videoRef) {
         if (user?._id) {
            ProductServices.checkUserLike({
               product_id: productDetailCurrentState._id,
               user_id: user?._id,
            }).then((res) => {
               if (res.isLike) setLikeState(true);
               else setLikeState(false);
            });
         }
      }
   }, [productDetailCurrentState, user]);

   useEffect(() => {
      return () => {
         loadReadyPage(false);
         setLoadFull(false);
      };
   });

   useEffect(() => {
      if (isReadyPage) {
         setLoadFull(true);
      }
   }, [
      productDetailCurrentState,
      user,
      showShareState,
      likeState,
      countLikeState,
      productCurrentState,
      pageRecommendProducts,
      hasMore,
      loadingMore,
      recommendProducts,
   ]);

   return (
      <WrapperPage>
         {loading ? (
            <></>
         ) : (
            <>
               <div ref={wrapperRef} className={cx('wrapper')}>
                  <div className={cx('inner')}>
                     <div className={cx('wrapper_of_block', 'top')}>
                        <div className={cx('wrapper_video')}>
                           <Video videoInfo={videoInfoState}></Video>
                        </div>
                     </div>
                     <div className={cx('page-body')}>
                        <div className={cx('body-left')}>
                           <div
                              className={cx(
                                 'title-product',
                                 'string-formatted large strong',
                                 'content-empty w-100 h-20',
                              )}
                           >
                              {loading
                                 ? ''
                                 : productCurrentState._name +
                                   ' - Tập ' +
                                   productDetailCurrentState.episode}
                           </div>

                           <div className={cx('wrapper_of_block', 'wrapper-block-action')}>
                              <div className={cx('sperator')}></div>
                              <div className={cx('action__video-list')}>
                                 <div className={cx('action__video-item')}>
                                    {likeState ? (
                                       <>
                                          <Button
                                             className={cx('action__video-item-button')}
                                             rounded
                                             transparent
                                             hover
                                             leftIcon={
                                                <AiFillLike
                                                   className={cx('action__video-item-button-icon')}
                                                />
                                             }
                                             onClick={() => {
                                                if (user?._id) {
                                                   ProductServices.dislike({
                                                      product_id: productDetailCurrentState._id,
                                                      user_id: user?._id,
                                                   });
                                                   setLikeState(false);
                                                   setCountLikeState((prev) => --prev);
                                                } else {
                                                   navigate('/login');
                                                }
                                             }}
                                          >
                                             <div className={cx('action__video-item-button-title')}>
                                                {formatFollowCount(countLikeState)}
                                             </div>
                                          </Button>
                                       </>
                                    ) : (
                                       <>
                                          <Button
                                             className={cx('action__video-item-button')}
                                             rounded
                                             transparent
                                             hover
                                             leftIcon={
                                                <AiOutlineLike
                                                   className={cx('action__video-item-button-icon')}
                                                />
                                             }
                                             onClick={() => {
                                                if (user?._id) {
                                                   ProductServices.like({
                                                      product_id: productDetailCurrentState._id,
                                                      user_id: user?._id,
                                                   });
                                                   setLikeState(true);
                                                   setCountLikeState((prev) => ++prev);
                                                } else {
                                                   navigate('/login');
                                                }
                                             }}
                                          >
                                             <div className={cx('action__video-item-button-title')}>
                                                {formatFollowCount(countLikeState)}
                                             </div>
                                          </Button>
                                       </>
                                    )}
                                 </div>

                                 <div className={cx('action__video-item')}>
                                    <Button
                                       className={cx('action__video-item-button')}
                                       rounded
                                       transparent
                                       hover
                                       leftIcon={
                                          <RiShareForwardLine
                                             className={cx('action__video-item-button-icon')}
                                          />
                                       }
                                       onClick={() => {
                                          setShowShareState(true);
                                       }}
                                    >
                                       <div className={cx('action__video-item-button-title')}>
                                          Chia sẻ
                                       </div>
                                    </Button>

                                    {showShareState && (
                                       <div className={cx('share-wrapper')}>
                                          <div className={cx('share-inner')}>
                                             <div className={cx('share-header')}>
                                                <div className={cx('share-header-left')}>
                                                   <h3>Chia sẻ</h3>
                                                </div>
                                                <div className={cx('share-header-right')}>
                                                   <Button
                                                      onClick={() => {
                                                         setShowShareState(false);
                                                      }}
                                                      hover
                                                      transparent
                                                      className={cx('btn-share-close')}
                                                   >
                                                      <IoMdClose />
                                                   </Button>
                                                </div>
                                             </div>
                                             <div className={cx('share-inner-top')}>
                                                <div className={cx('share-list')}>
                                                   <div className={cx('share-item')}>
                                                      <ShareFacebook
                                                         valueUrlState={valueUrlState}
                                                         videoInf={{
                                                            videoTitle:
                                                               productCurrentState._name +
                                                               ' - Tập' +
                                                               productDetailCurrentState.episode,
                                                            videoDescription:
                                                               productCurrentState.description,
                                                            videoImage: productCurrentState.img,
                                                         }}
                                                      />
                                                   </div>
                                                </div>
                                             </div>
                                             <div className={cx('share-inner-bottom')}>
                                                <input
                                                   ref={inputClipboardRef}
                                                   type="text"
                                                   readOnly
                                                   value={valueUrlState}
                                                />

                                                <Button
                                                   onClick={handleclipboard}
                                                   primary
                                                   className={cx('btn-coppy-share')}
                                                >
                                                   <div>Sao chép</div>
                                                </Button>
                                             </div>
                                          </div>
                                       </div>
                                    )}
                                 </div>

                                 <div className={cx('action__video-item')}>
                                    <Button
                                       className={cx('action__video-item-button')}
                                       rounded
                                       transparent
                                       hover
                                       leftIcon={
                                          <MdOutlinePlaylistAdd
                                             className={cx('action__video-item-button-icon')}
                                          />
                                       }
                                    >
                                       <div className={cx('action__video-item-button-title')}>
                                          Lưu
                                       </div>
                                    </Button>
                                 </div>
                              </div>
                           </div>

                           <div>
                              <div
                                 className={cx('wrapper_of_block', 'container', 'wrapper_detail')}
                              >
                                 <div className={cx('detail')}>
                                    <div className={cx('inf__header')}>
                                       <span className={cx('string-formatted')}>
                                          {formatFollowCount(productDetailCurrentState.views)} lượt
                                          xem
                                       </span>
                                       <span className={cx('string-formatted')}> - </span>
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
                                          {loading ? '' : productCurrentState.description}
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
                                          {loading ? '' : productCurrentState.releaseDate}
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
                                             !loading ? '' : 'content-empty w-100 h-20',
                                             'text-align-justify',
                                          )}
                                       >
                                          {productCurrentState.country_Of_Origin}
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
                                          {loading ? '' : productCurrentState.currentEpisodes}/
                                          {loading ? '' : productCurrentState.episodes}
                                       </div>
                                    </div>

                                    <div className={cx('wrapper-count', 'categories')}>
                                       <span className={cx('string-formatted strong')}>
                                          Thể loại:
                                       </span>
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
                                 </div>
                              </div>
                           </div>

                           <div className={cx('wrapper_of_block', 'container')}>
                              <div className={cx('header-inner eposide__header')}>
                                 <span className={cx('string-formatted strong')}>Chọn tập</span>
                              </div>
                              <div className={cx('list-episodes')}>
                                 {productCurrent.product_details &&
                                 productCurrent.product_details.length > 0 ? (
                                    sortedEpisodes(productCurrent.product_details).map(
                                       (element, index) => {
                                          if (element._id === episodeCurrent) {
                                             return (
                                                <Link
                                                   to={`/watch?parent_id=${parent_id}&episodes=${element._id}`}
                                                   key={'episodes1' + element?.episode + index}
                                                   className={cx('item-episodes', 'active')}
                                                >
                                                   {element.episode}
                                                </Link>
                                             );
                                          }

                                          return (
                                             <Link
                                                to={`/watch?parent_id=${parent_id}&episodes=${element._id}`}
                                                key={'episodes2' + element?.episode + index}
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

                           {!!productCurrentState && (
                              <Comment
                                 key={tempDetailRef.current._id}
                                 ref={childRef}
                                 parent_id={tempDetailRef.current._id}
                              />
                           )}
                        </div>
                        <div className={cx('body-right')}>
                           <div className={cx('heading_of_block')}>
                              <h3 className={cx('title')}>Đề xuất</h3>
                           </div>
                           <div className={cx('sperator', 'custom-sperator')}></div>
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
                                    loadingComponent={<></>}
                                 >
                                    {recommendProducts.map((element, index) => (
                                       <div
                                          key={'recommendProducts1' + index}
                                          className={cx('productTest')}
                                       >
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
            </>
         )}
      </WrapperPage>
   );
};

export default Watch;
