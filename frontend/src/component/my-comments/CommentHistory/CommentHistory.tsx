/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { deleteCmt } from "../../../api/comment.api";
import { MyCommentHistoryItem } from "../../../types/comment.type";
import { formatDate } from "../../../utils/helper/date";
import { groupDataByDate } from "../../../utils/helper/groupItemByDate";
import HistoryActionPopover from "../../shared/HistoryActionPopover/HistoryActionPopover";
import styles from "./CommentHistory.module.scss";

interface CommentHistoryProps {
  comments: MyCommentHistoryItem[];
}

function CommentHistoryItem({ comment }: { comment: MyCommentHistoryItem }) {
  const queryClient = useQueryClient();

  const { mutate: removeComment } = useMutation({
    mutationFn: deleteCmt,
    onSuccess: () => {
      toast.success("Comment deleted");
      queryClient.invalidateQueries({ queryKey: ["my-comments"] });
    },
  });

  return (
    <div key={comment._id} className={styles.commentItemRow}>
      <Link
        to={`/blog/${comment.slug}#comment-${comment._id}`}
        className={styles.commentLink}>
        <div className={styles.commentDetails}>
          <div>
            <h4 className={!comment.blogExists ? styles.deleted : ""}>
              {comment.blogExists
                ? comment.title
                : "This blog has been deleted"}
            </h4>
            <p>{comment.content}</p>
          </div>
        </div>
      </Link>

      <HistoryActionPopover
        deleteLabel="Delete comment"
        onDelete={() => removeComment(comment._id)}
      />
    </div>
  );
}

function CommentHistory({ comments }: CommentHistoryProps) {
  const groupedComments = groupDataByDate(comments, (item) => item.createdAt);
  const groupedEntries = Object.entries(groupedComments);

  return (
    <div className={styles.container}>
      {groupedEntries.map(([dateKey, items]) => (
        <div key={dateKey} className={styles.dateSection}>
          <h3 className={styles.dateHeader}>{formatDate(dateKey)}</h3>

          <div className={styles.commentsListCard}>
            {items.map((comment) => (
              <CommentHistoryItem comment={comment} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentHistory;
