import {
   memo,
   useRef,
   useState,
   useEffect,
   useContext,
   forwardRef,
   useCallback,
   useImperativeHandle,
} from 'react';
import io from 'socket.io-client';
import classNames from 'classnames/bind';
import LazyLoading from '../loading/LazyLoading';
import styles from './Comment.module.scss';
import { AuthContext } from '~/contexts/auth';
import CommentServices from '~/services/CommentServices';
import { CommentLists, CommentWrite } from '~/components/Comment';

const cx = classNames.bind(styles);

const Comment = forwardRef(({ parent_id = null }, ref) => {
   const {
      authState: { user },
   } = useContext(AuthContext);

   const [suggestedComments, setSuggestedComments] = useState([]);
   const [pageSuggestedComments, setPageSuggestedComments] = useState(-1);
   const [hasMore, setHasMore] = useState(false);
   const [loadingMore, setLoadingMore] = useState(false);

   const LENGTH_PAGE = 1;

   const socket = io('http://localhost:3001');
   const [comments, setComments] = useState([]);

   const childRef = useRef();

   const beforeLoadCommentSuggested = () => {
      setLoadingMore(true);
      setHasMore(true);
   };

   useEffect(() => {}, [parent_id]);

   const loadCommentSuggested = async (page) => {
      const response = await CommentServices.fetchComments({
         parent_id,
         skip: page * LENGTH_PAGE,
         limit: LENGTH_PAGE,
      });

      if (response.success) {
         setSuggestedComments((prev) => [...prev, ...response.comments]);
         setLoadingMore(false);

         if (response.comments.length > LENGTH_PAGE) {
            setHasMore(true);
            setPageSuggestedComments(page);
         } else if (response.comments.length > 0 && response.comments.length <= LENGTH_PAGE) {
            setHasMore(false);
            setPageSuggestedComments(page);
         } else if (response.comments.length <= 0) {
            setHasMore(false);
            setPageSuggestedComments(page - 1);
         }
      } else {
         console.log('nug');
      }
   };

   useEffect(() => {
      setComments(suggestedComments.map((element) => element.comment_details));
   }, [suggestedComments]);

   useEffect(() => {
      socket.on('comment', (comment) => {
         setComments((prev) => [comment, ...prev]);
      });

      return () => {
         socket.disconnect();
      };
   }, [socket]);

   const handleComment = useCallback(
      async (text) => {
         await CommentServices.addComment({
            parent_id,
            user_id: user._id,
            content: text || ' ',
         })
            .then((response) => {
               if (response.success) {
                  const comment =
                     response.comments.comment_details[
                        response.comments.comment_details.length - 1
                     ];

                  comment._name = user._name;
                  comment.img = user.img;

                  socket.emit('comment', comment);
               }
            })
            .catch((error) => {});
      },
      [socket, comments],
   );

   useImperativeHandle(ref, () => ({
      handleScroll(parentNode) {
         if (hasMore) {
            childRef.current.handleScroll(parentNode);
         }
      },
   }));

   return (
      <div ref={ref} className={cx('wrapper_of_block', 'container')}>
         <div className={cx('comment')}>
            <div className={cx('comment__header')}>
               <div className={cx('header-inner')}>
                  <span className={cx('string-formatted strong')}>2.369 bình luận</span>
               </div>

               <div className={cx('wrapper-comment')}>
                  <div className={cx('comment-top')}>
                     <CommentWrite handleComment={handleComment}></CommentWrite>
                  </div>
                  <div className={cx('comment-bottom')}>
                     <LazyLoading
                        ref={childRef}
                        hasMore={hasMore}
                        loadingMore={loadingMore}
                        pageCurrent={pageSuggestedComments}
                        beforeLoad={beforeLoadCommentSuggested}
                        loadProductMore={loadCommentSuggested}
                        loadingComponent={<></>}
                     >
                        <CommentLists comments={comments}></CommentLists>
                     </LazyLoading>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
});

export default memo(Comment);
