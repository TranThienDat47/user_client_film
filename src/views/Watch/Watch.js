import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import Button from '~/components/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Comment } from '~/components/Comment';

import classNames from 'classnames/bind';
import styles from './Watch.module.scss';
import { GlobalContext } from '~/contexts/global';

import Video from '~/components/Video/index';
import imgs from '~/assets/img';
import { converterDate, converterDateTitle, sortedEpisodes } from '~/utils/validated';
import { ProductContext } from '~/contexts/product';
import { ProductItem } from '~/components/ProductItem';
import LazyLoading from '~/components/loading/LazyLoading';

const cx = classNames.bind(styles);

const Watch = () => {
   const {
      globalState: { productCurrent, loading },
      setProductCurrent,
   } = useContext(GlobalContext);

   const {
      productState: { pageRecommendProducts, hasMore, loadingMore, recommendProducts },
      beforeLoadReCommendProduct,
      loadRecommendProduct,
   } = useContext(ProductContext);

   const navigate = useNavigate();

   const location = useLocation();
   const params = new URLSearchParams(location.search);
   const parent_id = params.get('parent_id');
   const episodeCurrent = params.get('episodes');

   const [productCurrentState, setProductCurrentState] = useState({});
   const [productDetailCurrentState, setProductDetailCurrentState] = useState({});
   const wrapperRef = useRef(null);
   const childRef = useRef(null);
   const childRefRecommend = useRef(null);
   const tempDetailRef = useRef({ _id: null, episode: null });

   useEffect(() => {
      setProductCurrent({ _id: parent_id });
   }, [parent_id]);

   useEffect(() => {
      if (productCurrent.product_details && productCurrent.product_details.length > 0) {
         const tempDetail = sortedEpisodes(productCurrent.product_details).find(
            (element, index) => element._id === episodeCurrent,
         );

         tempDetailRef.current = { _id: tempDetail?._id, episode: tempDetail?.episode };
         setProductDetailCurrentState({ _id: tempDetail?._id, episode: tempDetail?.episode });
      }
      wrapperRef.current.scrollTo({ top: 0, behavior: 'smooth' });
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
      }

      if (
         tempDetailRef.current?._id !== null &&
         productCurrent.product &&
         tempDetailRef.current?._id !== episodeCurrent
      ) {
         navigate(`/product?id=${parent_id}`);
      }
   }, [productCurrent, parent_id]);

   useEffect(() => {
      if (wrapperRef.current) {
         wrapperRef.current.onscroll = () => {
            childRef.current?.handleScroll(wrapperRef.current);
            childRefRecommend.current?.handleScroll(wrapperRef.current);
         };
      }
   }, [loading]);

   return (
      <>
         {loading ? (
            <></>
         ) : (
            <>
               <div ref={wrapperRef} className={cx('wrapper')}>
                  <div className={cx('inner')}>
                     <div className={cx('wrapper_of_block', 'top')}>
                        <div className={cx('wrapper_video')}>
                           <Video></Video>
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
                           <div>
                              <div
                                 className={cx('wrapper_of_block', 'container', 'wrapper_detail')}
                              >
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

                           <Comment
                              key={tempDetailRef.current._id}
                              ref={childRef}
                              parent_id={tempDetailRef.current._id}
                           />
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
                                    beforeLoad={beforeLoadReCommendProduct}
                                    loadProductMore={loadRecommendProduct}
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
      </>
   );
};

export default Watch;
