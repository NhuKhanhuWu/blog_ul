/** @format */

import { Link } from "react-router-dom";
import {
  GroupedVotes,
  MyBlogVote,
  MyCommentVote,
} from "../../../types/vote.type";
import { formatDate } from "../../../utils/date";
import styles from "./VoteHistory.module.scss";

interface VoteHistoryProps {
  groupedVotes: GroupedVotes;
}

const getVoteUrl = (vote: MyBlogVote | MyCommentVote) => {
  const baseUrl = `/blogs/${vote.slug}`;

  return "commentId" in vote ? `${baseUrl}#comment-${vote.commentId}` : baseUrl;
};

function VoteHistory({ groupedVotes }: VoteHistoryProps) {
  const groupedEntries = Object.entries(groupedVotes);

  return (
    <div className={styles.container}>
      {groupedEntries.map(([dateKey, votes]) => (
        <div key={dateKey} className={styles.dateSection}>
          <h3 className={styles.dateHeader}>{formatDate(dateKey)}</h3>

          <div className={styles.votesListCard}>
            {votes.map((vote) => (
              <Link
                to={getVoteUrl(vote)}
                key={vote._id}
                className={styles.voteItemRow}>
                <div className={styles.voteDetails}>
                  <div>
                    <h4>{vote.title}</h4>

                    {/* for comment vote */}
                    {"commentContent" in vote && <p>{vote.commentContent}</p>}
                  </div>
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
