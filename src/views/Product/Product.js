import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import Button from '~/components/Button';
import styles from './Product.module.scss';
import { ProductItem } from '~/components/ProductItem';
import { Comment } from '~/components/Comment';
import { GlobalContext } from '~/contexts/global';

import imgs from '~/assets/img';

import { converterDate, converterDateTitle, sortedEpisodes } from '~/utils/validated';
import LazyLoading from '~/components/loading/LazyLoading';
import { ProductContext } from '~/contexts/product';

const cx = classNames.bind(styles);

const Product = () => {
   const {
      globalState: { productCurrent, product_details, loading },
      setProductCurrent,
   } = useContext(GlobalContext);

   const {
      productState: { pageRecommendProducts, hasMore, loadingMore, recommendProducts },
      beforeLoadReCommendProduct,
      loadRecommendProduct,
   } = useContext(ProductContext);

   const [productCurrentState, setProductCurrentState] = useState({});

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const parent_id = params.get('id');

   const listEpisodes = new Array(100).fill(0);

   const childRefComment = useRef(null);
   const childRefRecommend = useRef(null);
   const wrapperRef = useRef(null);
   const tempWatchRef = useRef(null);

   useEffect(() => {
      setProductCurrent({ _id: parent_id });
   }, [parent_id]);

   useEffect(() => {
      if (productCurrent.product) {
         let currentState = {};

         currentState._name = productCurrent.product._name;
         currentState.anotherName = productCurrent.product.anotherName;
         currentState.description = productCurrent.product.description;
         currentState.img = productCurrent.product.img;
         currentState.episodes = productCurrent.product.episodes;
         currentState.currentEpisodes = productCurrent.product.currentEpisodes;
         currentState.view = productCurrent.product.view;
         currentState.releaseDate = converterDate(productCurrent.product.releaseDate);
         currentState.news = productCurrent.product.news;
         currentState.reacts = productCurrent.product.reacts;
         currentState.categories = productCurrent.product.reacts;
         currentState.background = productCurrent.product.background;
         currentState.country_Of_Origin = productCurrent.product.country_Of_Origin;
         currentState.createdAt = productCurrent.product.createdAt;
         currentState.categories = productCurrent.product.categories;

         setProductCurrentState(currentState);
         wrapperRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
   }, [productCurrent, parent_id]);

   useEffect(() => {
      wrapperRef.current.onscroll = () => {
         childRefComment.current.handleScroll(wrapperRef.current);
         childRefRecommend.current.handleScroll(wrapperRef.current);
      };
   }, []);

   return (
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
                        {loading ? '' : productCurrentState._name}
                     </div>
                     <div className={cx('top__another-name', 'content-empty w-200 h-23')}>
                        {loading ? '' : productCurrentState.anotherName}
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
                                 {loading ? '' : productCurrentState.releaseDate}
                              </div>
                           </div>
                           <div className={cx('wrapper-count', 'count-episode')}>
                              <span>Số tập:</span>
                              <div
                                 className={cx(
                                    'content-empty w-100 h-20',
                                    'string-formatted',
                                    'strong',
                                 )}
                              >
                                 {loading ? '' : productCurrentState.currentEpisodes}/
                                 {loading ? '' : productCurrentState.episodes}
                              </div>
                           </div>
                           <div className={cx('wrapper-count', 'count-views')}>
                              <span>Số người theo dõi:</span>
                              <div
                                 className={cx(
                                    'content-empty w-100 h-20',
                                    'string-formatted',
                                    'strong',
                                 )}
                              >
                                 123N
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
                                       productCurrent.product_details &&
                                       productCurrent.product_details.length <= 0
                                          ? true
                                          : false
                                    }
                                 >
                                    Xem phim
                                 </Button>
                                 <Button grey rounded className={cx('btn_follow')}>
                                    Xem sau
                                 </Button>
                                 <Button grey rounded className={cx('btn_watching')}>
                                    Theo dõi
                                 </Button>
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
                                 <Link to={'#'} key={element._id ? element._id : index}>
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
                              <span className={cx('string-formatted')}>132N lượt xem</span>
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
                                    'content-empty w-100 h-20',
                                    'text-align-justify',
                                 )}
                              >
                                 {loading ? '' : productCurrentState.country_Of_Origin}
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
                        {productCurrent.product_details?.length > 0 ? (
                           sortedEpisodes(productCurrent.product_details).map((element, index) => {
                              if (index === productCurrent.product_details.length - 1) {
                                 tempWatchRef.current = `/watch?parent_id=${parent_id}&episodes=${productCurrent.product_details[index]._id}`;
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
                           })
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
                           beforeLoad={beforeLoadReCommendProduct}
                           loadProductMore={loadRecommendProduct}
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
   );
};

export default Product;
