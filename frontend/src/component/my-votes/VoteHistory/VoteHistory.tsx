/** @format */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { toggleVote } from "../../../api/vote.api";
import {
  GroupedVotes,
  MyBlogVote,
  MyCommentVote,
} from "../../../types/vote.type";
import { formatDate } from "../../../utils/date";
import HistoryActionPopover from "../../shared/HistoryActionPopover/HistoryActionPopover";
import styles from "./VoteHistory.module.scss";

interface VoteHistoryProps {
  groupedVotes: GroupedVotes;
}

const getVoteUrl = (vote: MyBlogVote | MyCommentVote) => {
  const baseUrl = `/blogs/${vote.slug}`;

  return "commentId" in vote ? `${baseUrl}#comment-${vote.commentId}` : baseUrl;
};

function VoteHistory({ groupedVotes }: VoteHistoryProps) {
  const queryClient = useQueryClient();

  const { mutate: removeVote } = useMutation({
    mutationFn: toggleVote,
    onSuccess: () => {
      toast.success("Vote removed");
      queryClient.invalidateQueries({ queryKey: ["my-blog-votes"] });
      queryClient.invalidateQueries({ queryKey: ["my-cmt-votes"] });
    },
  });

  const groupedEntries = Object.entries(groupedVotes);

  const handleDeleteVote = (vote: MyBlogVote | MyCommentVote) => {
    const targetId = "commentId" in vote ? vote.commentId : vote._id;
    const targetType = "commentId" in vote ? "comment" : "blog";

    removeVote({
      targetId,
      targetType,
      voteType: vote.voteType,
    });
  };

  return (
    <div className={styles.container}>
      {groupedEntries.map(([dateKey, votes]) => (
        <div key={dateKey} className={styles.dateSection}>
          <h3 className={styles.dateHeader}>{formatDate(dateKey)}</h3>

          <div className={styles.votesListCard}>
            {votes.map((vote) => (
              <div key={vote._id} className={styles.voteItemRow}>
                <Link to={getVoteUrl(vote)} className={styles.voteLink}>
                  <div className={styles.voteDetails}>
                    <div>
                      <h4>{vote.title}</h4>

                      {"commentContent" in vote && <p>{vote.commentContent}</p>}
                    </div>
                  </div>

                  <span
                    className={`${styles.badge} ${vote.voteType === 1 ? styles.upvoted : styles.downvoted}`}>
                    {vote.voteType === 1 ? "↑ Upvoted" : "↓ Downvoted"}
                  </span>
                </Link>

                <HistoryActionPopover
                  deleteLabel="Remove vote"
                  onDelete={() => handleDeleteVote(vote)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VoteHistory;
