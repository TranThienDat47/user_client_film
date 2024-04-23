import { memo } from 'react';
import CommentItem from './CommentItem';

function CommentLists({ parentID = null, comments = [], modeReply = false }) {
   return (
      <>
         {comments.map((comment) => (
            <CommentItem
               key={comment._id}
               parentId={parentID}
               data={comment}
               modeReply={modeReply}
            ></CommentItem>
         ))}
      </>
   );
}

export default memo(CommentLists);
