import io from 'socket.io-client';
import classNames from 'classnames/bind';
import { useState, useEffect, useRef, memo, useContext, useCallback } from 'react';
import { AiOutlineLike, AiOutlineDown, AiOutlineUp, AiFillLike } from 'react-icons/ai';

import Button from '../Button';
import imgs from '~/assets/img';
import CommentLists from './CommentList';
import CommentWrite from './CommentWrite';
import styles from './Comment.module.scss';
import { AuthContext } from '~/contexts/auth';
import { validateTime } from '~/utils/validated';
import MoreLoading from '../loading/MoreLoading';
import CommentServices from '~/services/CommentServices';

const cx = classNames.bind(styles);

const LENGTH_PAGE = 1;

function CommentItem({
   parentId = null,
   data = { _id: '', _name: '', img: '', content: '', likes: 0, replies: 0, createdAt: 'vừa xong' },
   modeReply = false,
   ...passProp
}) {
   const classes = cx('wrapper', {
      modeReply,
      ...passProp,
   });

   const {
      authState: { user },
   } = useContext(AuthContext);

   const socket = io('http://localhost:3001');

   const [showReplies, setShowReplies] = useState(false);
   const [likeComment, setLikeComment] = useState(false);
   const [numLikeComment, setNumLikeComment] = useState(data.likes);
   const [commentReplies, setCommentReplies] = useState([]);
   const [showReplyWrite, setShowReplyWrite] = useState(false);

   //Loading more with show more

   const [time, setTime] = useState(0);
   const [hasMore, setHasMore] = useState(false);
   const [loadingMore, setLoadingMore] = useState(false);
   const [suggestedComments, setSuggestedComments] = useState([]);
   const [pageSuggestedComments, setPageSuggestedComments] = useState(-1);

   const timeRef = useRef(0);
   const btnReplyRef = useRef();
   const btnShowReplyRef = useRef();

   const childRef = useRef(null);

   const beforeLoadCommentSuggested = () => {
      setHasMore(true);
      setLoadingMore(true);
   };

   const loadCommentSuggested = async (page) => {
      const response = await CommentServices.fetchComments({
         parent_id: data._id,
         skip: page * LENGTH_PAGE,
         limit: LENGTH_PAGE,
      });

      if (response.success) {
         setSuggestedComments((prev) => [...response.comments, ...prev]);
         setLoadingMore(false);

         if (response.comments.length >= LENGTH_PAGE) {
            setPageSuggestedComments(page);

            const check = await CommentServices.fetchComments({
               parent_id: data._id,
               skip: (page + 1) * LENGTH_PAGE,
               limit: LENGTH_PAGE,
            });

            if (check.success && check.comments.length > 0) setHasMore(true);
            else setHasMore(false);
         } else if (response.comments.length > 0 && response.comments.length < LENGTH_PAGE) {
            setHasMore(false);
            setPageSuggestedComments(page);
         } else if (response.comments.length <= 0) {
            setHasMore(false);
            setPageSuggestedComments(page - 1);
         }
      } else {
         console.log('sai');
      }
   };

   const handleShowAndHideReplyWrite = () => {
      setShowReplyWrite(false);
   };

   const handleComment = async (text) => {
      await CommentServices.addComment({
         parent_id: modeReply ? parentId : data._id,
         user_id: user._id,
         content: text || ' ',
         isReply: true,
         reply_with: modeReply ? { parentId, _name: data._name } : undefined,
      })
         .then((response) => {
            const comment =
               response.comments.comment_details[response.comments.comment_details.length - 1];

            comment._name = user._name;
            comment.img = user.img;

            socket.emit('comment_reply', comment);

            data.replies++;
         })
         .catch((error) => {});
   };

   const fetchNumLikes = async (e) => {
      const fetchDislikeComment = await CommentServices.getNumLikeComment({
         comment_detail_id: data._id,
      }).then((response) => {
         if (response.success) {
            setNumLikeComment(response.num_like_comments);
         }
      });
   };

   const handleLikeComment = async (e) => {
      if (likeComment) {
         setLikeComment(false);
         setNumLikeComment((prev) => {
            if (prev - 1 < 0) return 0;
            else return prev - 1;
         });
         const fetchDislikeComment = await CommentServices.disLikeComment({
            comment_id: data._id,
            user_id: user._id,
         }).then((response) => {
            // if (response.success) setLikeComment(false);
         });
      } else {
         setLikeComment(true);
         setNumLikeComment((prev) => prev + 1);
         const fetchLikeComment = await CommentServices.likeComment({
            comment_id: data._id,
            user_id: user._id,
            content: data.content,
         }).then((response) => {
            // if (response.success) setLikeComment(true);
         });
      }

      // await fetchNumLikes();
   };

   useEffect(() => {}, [likeComment]);

   useEffect(() => {
      if (user) {
         const fetchCheckUserLikeComment = CommentServices.checkUserLikeComment({
            comment_id: data._id,
            user_id: user._id,
         }).then((result) => {
            if (result.success && result.likeComment) {
               setLikeComment(true);
            }
         });
      }
   }, [user]);

   useEffect(() => {
      timeRef.current = validateTime(data.createdAt).realValue;

      const curInterVal = setInterval(() => {
         setTime((prev) => -prev);
      }, timeRef.current);

      return () => {
         clearInterval(curInterVal);
      };
   }, [time]);

   useEffect(() => {
      if (btnShowReplyRef.current) {
         btnShowReplyRef.current.onclick = () => {
            setShowReplies((prev) => !prev);
         };
      }
   }, [showReplies, btnShowReplyRef.current]);

   useEffect(() => {
      btnReplyRef.current.onclick = () => {
         setShowReplyWrite(true);
         if (childRef.current) childRef.current.handleFocusTextAria();
         setShowReplies(true);
      };
   }, []);

   useEffect(() => {
      setCommentReplies(suggestedComments.map((element) => element.comment_details));
   }, [suggestedComments]);

   useEffect(() => {
      socket.on('comment_reply', (comment) => {
         setCommentReplies((prev) => [...prev, comment]);
      });

      return () => {
         socket.disconnect();
      };
   }, [socket, data._id, suggestedComments]);

   return (
      <div className={classes} {...passProp}>
         <div className={cx('inner-top')}>
            <div className={cx('comment-left')}>
               <div className={cx('avata')}>
                  <img
                     className={cx('avt')}
                     src={data.img}
                     alt=""
                     onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = imgs.noImage;
                     }}
                  />
               </div>
            </div>
            <div className={cx('comment-right')}>
               <div className={cx('info')}>
                  <span className={cx('string-formatted strong small')}>{data._name}</span>
                  <span className={cx('string-fomatted')}> </span>
                  <span className={cx('string-formatted very-small blur')}>
                     {(validateTime(data.createdAt).value || '') +
                        ' ' +
                        validateTime(data.createdAt).unit}
                  </span>
               </div>
               <div className={cx('content')}>
                  {modeReply && data?.reply_with?._name ? (
                     <>
                        <a style={{ color: 'var(--link-color)', cursor: 'pointer' }}>
                           @{data?.reply_with?._name}
                        </a>{' '}
                        {data?.content}
                     </>
                  ) : (
                     data?.content
                  )}
               </div>
            </div>
         </div>
         <div className={cx('inner-bottom')}>
            <div className={cx('controls')}>
               <div>
                  <Button
                     onClick={(e) => {
                        handleLikeComment(e);
                     }}
                     className={cx('like')}
                     transparent
                     hover
                  >
                     {likeComment ? <AiFillLike /> : <AiOutlineLike />}
                  </Button>
                  <span className={cx('string-fomatted')}>{numLikeComment}</span>
               </div>
               <Button ref={btnReplyRef} className={cx('reply')} transparent hover>
                  Phản hồi
               </Button>
            </div>
            <div className={cx('options')}></div>

            {showReplyWrite && (
               <div className={cx('wrapper-comment__write')}>
                  <CommentWrite
                     ref={childRef}
                     modeReply
                     handleShowAndHideReplyWrite={handleShowAndHideReplyWrite}
                     handleComment={handleComment}
                  />
               </div>
            )}

            {data.replies > 0 && !modeReply && (
               <div className={cx('replies')}>
                  <div className={cx('reply-header')}>
                     <Button
                        ref={btnShowReplyRef}
                        className={cx('show-reply')}
                        leftIcon={!showReplies ? <AiOutlineDown /> : <AiOutlineUp />}
                        hover
                        transparent
                     >
                        {showReplies && 'ẩn'} {data.replies} phản hồi
                     </Button>
                  </div>

                  {showReplies && (
                     <MoreLoading
                        hasMore={hasMore}
                        loadingMore={loadingMore}
                        pageCurrent={pageSuggestedComments}
                        beforeLoad={beforeLoadCommentSuggested}
                        loadProductMore={loadCommentSuggested}
                     >
                        <CommentLists parentID={data._id} comments={commentReplies} modeReply />
                     </MoreLoading>
                  )}
               </div>
            )}
         </div>
      </div>
   );
}

export default memo(CommentItem);
