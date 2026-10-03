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
import { formatDate } from "../../../utils/helper/date";
import HistoryActionPopover from "../../shared/HistoryActionPopover/HistoryActionPopover";
import styles from "./VoteHistory.module.scss";

interface VoteHistoryProps {
  groupedVotes: GroupedVotes;
}

interface VoteHistoryItemProps {
  vote: MyBlogVote | MyCommentVote;
}

const getVoteUrl = (vote: MyBlogVote | MyCommentVote) => {
  const baseUrl = `/blog/${vote.slug}`;

  return "commentId" in vote ? `${baseUrl}#comment-${vote.commentId}` : baseUrl;
};

function VoteHistoryItem({ vote }: VoteHistoryItemProps) {
  const queryClient = useQueryClient();

  const { mutate: removeVote } = useMutation({
    mutationFn: toggleVote,
    onSuccess: () => {
      toast.success("Vote removed");

      queryClient.invalidateQueries({
        queryKey: ["my-blog-votes"],
      });

      queryClient.invalidateQueries({
        queryKey: ["my-cmt-votes"],
      });
    },
  });

  const handleDeleteVote = (vote: MyBlogVote | MyCommentVote) => {
    const targetId = "commentId" in vote ? vote.commentId : vote._id;
    const targetType = "commentId" in vote ? "comment" : "blog";

    removeVote({
      targetId,
      targetType,
      voteType: vote.voteType,
    });
  };

  const isCommentVote = "commentId" in vote;
  const isCommentDeleted = isCommentVote && vote.commentExists === false;
  const isBlogDeleted = vote.blogExists === false;

  const voteContent = (
    <>
      <div className={styles.voteDetails}>
        <div>
          <h4
            className={isBlogDeleted || isCommentDeleted ? styles.deleted : ""}>
            {isCommentDeleted
              ? "This comment has been deleted"
              : isBlogDeleted
                ? "This blog has been deleted"
                : vote.title}
          </h4>

          {isCommentVote && !isCommentDeleted && <p>{vote.commentContent}</p>}
        </div>
      </div>

      <span
        className={`${styles.badge} ${
          vote.voteType === 1 ? styles.upvoted : styles.downvoted
        }`}>
        {vote.voteType === 1 ? "↑ Upvoted" : "↓ Downvoted"}
      </span>
    </>
  );

  return (
    <div className={styles.voteItemRow}>
      {isCommentDeleted || isBlogDeleted ? (
        <div className={styles.voteLink}>{voteContent}</div>
      ) : (
        <Link to={getVoteUrl(vote)} className={styles.voteLink}>
          {voteContent}
        </Link>
      )}

      <div className={styles.voteAction}>
        <HistoryActionPopover
          deleteLabel="Remove vote"
          onDelete={() => handleDeleteVote(vote)}
        />
      </div>
    </div>
  );
}

function VoteHistory({ groupedVotes }: VoteHistoryProps) {
  const groupedEntries = Object.entries(groupedVotes);

  return (
    <div className={styles.container}>
      {groupedEntries.map(([dateKey, votes]) => (
        <div key={dateKey} className={styles.dateSection}>
          <h3 className={styles.dateHeader}>{formatDate(dateKey)}</h3>

          <div className={styles.votesListCard}>
            {votes.map((vote) => (
              <>
                <VoteHistoryItem vote={vote} key={vote._id} />
              </>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VoteHistory;
