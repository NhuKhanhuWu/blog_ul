/** @format */

import { Link } from "react-router-dom";
import { MyCommentHistoryItem } from "../../../types/comment.type";
import { formatDate } from "../../../utils/date";
import { groupDataByDate } from "../../../utils/groupItemByDate";
import styles from "./CommentHistory.module.scss";

interface CommentHistoryProps {
  comments: MyCommentHistoryItem[];
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
              <Link
                key={comment._id}
                to={`/blogs/${comment.slug}#comment-${comment._id}`}
                className={styles.commentItemRow}>
                <div className={styles.commentDetails}>
                  <div>
                    <h4>{comment.title}</h4>
                    <p>{comment.content}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentHistory;
