/** @format */

import { Link } from "react-router-dom";
import { GroupedVotes } from "../../../types/vote.type";
import { formatDate } from "../../../utils/date";
import styles from "./VoteHistory.module.scss";

interface VoteHistoryProps {
  groupedVotes: GroupedVotes;
}

function VoteHistory({ groupedVotes }: VoteHistoryProps) {
  const groupedEntries = Object.entries(groupedVotes);
  // const link = `/blogs/`;

  return (
    <div className={styles.container}>
      {groupedEntries.map(([dateKey, votes]) => (
        <div key={dateKey} className={styles.dateSection}>
          <h3 className={styles.dateHeader}>{formatDate(dateKey)}</h3>

          <div className={styles.votesListCard}>
            {votes.map((vote) => (
              <Link
                to={`/blog/${vote.slug}${"commentId" in vote ? `?comment-id=${vote.commentId}` : ""}`}
                key={vote._id}
                className={styles.voteItemRow}>
                <div className={styles.voteDetails}>
                  {/* <div> */}
                  <h4>{vote.title}</h4>
                  {/* </div> */}

                  {/* for comment vote */}
                  {"commentContent" in vote && <p>{vote.commentContent}</p>}
                </div>

                {/* Dynamic class conditional matching inside styles object */}
                <span
                  className={`${styles.badge} ${vote.voteType === 1 ? styles.upvoted : styles.downvoted}`}>
                  {vote.voteType === 1 ? "↑ Upvoted" : "↓ Downvoted"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VoteHistory;
