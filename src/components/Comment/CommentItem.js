import io from 'socket.io-client';
import classNames from 'classnames/bind';
import { useState, useEffect, useRef, memo } from 'react';
import { AiOutlineLike, AiOutlineDown, AiOutlineUp, AiFillLike } from 'react-icons/ai';
import { HiOutlineDotsVertical } from 'react-icons/hi';

import Button from '../Button';
import imgs from '~/assets/img';
import CommentLists from './CommentList';
import CommentWrite from './CommentWrite';
import styles from './Comment.module.scss';
import { validateTime } from '~/utils/validated';
import MoreLoading from '../loading/MoreLoading';
import CommentServices from '~/services/CommentServices';
import { useSelector } from 'react-redux';
import { authSelector } from '~/redux/selectors/auth/authSelector';
import { Wrapper } from '~/components/Popper';

import Headless from '../Headless';
import MenuItem from '../Popper/Menu/MenuItem';
import { socketURL } from '~/config/constants';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const WIDTH_MENU_OPTION = 196;

const LENGTH_PAGE = 1;

function CommentItem({
   parentId = null,
   data = {
      _id: '',
      user_id: '',
      _name: '',
      img: '',
      content: '',
      likes: 0,
      replies: 0,
      createdAt: 'vừa xong',
   },
   modeReply = false,
   ...passProp
}) {
   const classes = cx('wrapper', 'wrapperCommentItem', {
      modeReply,
      ...passProp,
   });

   const { user } = useSelector(authSelector);

   const navigate = useNavigate();

   const [widthWindowState, setWidthWindowState] = useState(window.innerWidth);
   const [hoverMenuOption, setHoverMenuOption] = useState(false);
   const [optionOfset, setOptionOffset] = useState([0, 0]);
   const [showMenuOption, setShowMenuOption] = useState(false);

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

   const menuRef = useRef(null);
   const optionRef = useRef();
   const clickOptionRef = useRef(false);

   const timeRef = useRef(0);
   const btnReplyRef = useRef();
   const btnShowReplyRef = useRef();

   const childRef = useRef(null);
   const socketRef = useRef(null);

   const handleMouseEnter = () => {
      if (optionRef.current && !clickOptionRef.current) {
         optionRef.current.style.display = 'block';
         setHoverMenuOption(true);
      }
   };

   const handleMouseOut = () => {
      if (optionRef.current && !clickOptionRef.current) {
         optionRef.current.style.display = 'none';
         setHoverMenuOption(false);
      }
   };

   const renderOptionItem = (
      items = [{ title: 'Chỉnh sửa' }, { title: 'Trả lời' }, { title: 'Xóa', separate: true }],
   ) => {
      return items.map((item, index) => <MenuItem small key={index} data={item}></MenuItem>);
   };

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

         if (response.comments?.length >= LENGTH_PAGE) {
            setPageSuggestedComments(page);

            const check = await CommentServices.fetchComments({
               parent_id: data._id,
               skip: (page + 1) * LENGTH_PAGE,
               limit: LENGTH_PAGE,
            });

            if (check.success && check.comments?.length > 0) setHasMore(true);
            else setHasMore(false);
         } else if (response.comments?.length > 0 && response.comments.length < LENGTH_PAGE) {
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
      await CommentServices.addCommentReply({
         parent_id: modeReply ? parentId : data._id,
         user_id: user?._id,
         content: text || ' ',
         isReply: true,
         user_receiver_id: data.user_id,
         reply_with: modeReply ? { parentId, _name: data._name } : undefined,
      })
         .then((response) => {
            const comment =
               response.comments.comment_details[response.comments.comment_details.length - 1];

            comment._name = user._name;
            comment.img = user.img;

            socketRef.current.emit('comment_reply', comment);

            data.replies++;
         })
         .catch((error) => {});
   };

   const fetchNumLikes = async (e) => {
      await CommentServices.getNumLikeComment({
         comment_detail_id: data._id,
      }).then((response) => {
         if (response.success) {
            setNumLikeComment(response.num_like_comments);
         }
      });
   };

   const handleLikeComment = async (e) => {
      if (user?._id) {
         if (likeComment) {
            setLikeComment(false);
            setNumLikeComment((prev) => {
               if (prev - 1 < 0) return 0;
               else return prev - 1;
            });
            await CommentServices.disLikeComment({
               comment_id: data._id,
               user_id: user?._id,
            }).then((response) => {
               if (!response.success) setLikeComment(true);
            });
         } else {
            setLikeComment(true);
            setNumLikeComment((prev) => prev + 1);

            await CommentServices.likeComment({
               comment_id: data._id,
               user_id: data.user_id,
               user_send_id: user?._id,
               content: data.content,
            }).then((response) => {
               if (!response.success) setLikeComment(false);
            });
         }
      } else {
         navigate('/login');
      }

      // await fetchNumLikes();
   };

   useEffect(() => {
      if (
         WIDTH_MENU_OPTION >=
         window.innerWidth - optionRef.current.getBoundingClientRect().right
      ) {
         setOptionOffset([3, -156]);
      } else {
         setOptionOffset([3, -16]);
      }

      window.onresize = () => {
         setWidthWindowState(window.innerWidth);
      };
   }, [hoverMenuOption, widthWindowState]);

   // useEffect(() => {}, [likeComment]);

   useEffect(() => {
      if (user) {
         CommentServices.checkUserLikeComment({
            comment_id: data._id,
            user_id: user?._id,
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
      const socket = io(socketURL, { transports: ['websocket'] });

      socket.connect();

      socket.on('comment_reply', (comment) => {
         setCommentReplies((prev) => [...prev, comment]);
      });

      socketRef.current = socket;

      return () => {
         socket.disconnect();
      };
   }, []);
   // }, [suggestedComments, commentReplies]);

   return (
      <div
         className={classes}
         {...passProp}
         onMouseMove={handleMouseEnter}
         onMouseLeave={handleMouseOut}
      >
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

               <div
                  className={cx('comment-option')}
                  style={{ zIndex: showMenuOption ? '100' : '' }}
               >
                  <div ref={optionRef} className={cx('comment-option__inner')}>
                     <Headless
                        visible={showMenuOption}
                        offset={optionOfset}
                        className={cx('option-menu-wrapper')}
                        onClickOutside={() => {
                           clickOptionRef.current = false;

                           optionRef.current.style.display = 'none';
                           setShowMenuOption(false);
                        }}
                        render={() => {
                           return (
                              <Wrapper ref={menuRef} className={cx('option-menu')}>
                                 {renderOptionItem()}
                              </Wrapper>
                           );
                        }}
                     >
                        <Button
                           className={cx('option', 'menu')}
                           transparent
                           backgroundColor="var(--white)"
                           onClick={() => {
                              clickOptionRef.current = true;
                              setShowMenuOption((prev) => !prev);
                           }}
                        >
                           <HiOutlineDotsVertical />
                        </Button>
                     </Headless>
                  </div>
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
