/** @format */
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Cmt } from "../../../types/comment.type";
import styles from "./ReplyBtns.module.scss";

interface IReplyToggleButton {
  cmt: Cmt;
  isOpen: boolean;
  onToggle: () => void;
  hasNextPage: boolean;
  onFetchNext: () => void;
  isFetching: boolean;
}

const ReplyBtns = ({
  cmt,
  isOpen,
  onToggle,
  hasNextPage,
  onFetchNext,
  isFetching,
}: IReplyToggleButton) => {
  if (cmt.replyCount === 0) return null;

  return (
    <div className={styles.showHideBtn}>
      {/* btn Load More: only show when there is more */}
      {isOpen && hasNextPage && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFetchNext();
          }}
          disabled={isFetching}
          className={styles.loadMoreSmall}>
          {isFetching ? (
            "..."
          ) : (
            <>
              <IoIosArrowDown /> More
            </>
          )}
        </button>
      )}

      <button className="flex" onClick={onToggle}>
        {isOpen ? (
          <>
            <IoIosArrowUp /> Hide
          </>
        ) : (
          <>
            <IoIosArrowDown /> {cmt.replyCount} replies
          </>
        )}
      </button>
    </div>
  );
};

export default ReplyBtns;
