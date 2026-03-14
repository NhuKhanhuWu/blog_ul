/** @format */
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { ICmt } from "../../interface/cmtTypes";
import styles from "../../styles/component/BlogCmt.module.scss";

interface IReplyToggleButton {
  cmt: ICmt;
  isOpen: boolean;
  onToggle: () => void;
  hasNextPage: boolean;
  onFetchNext: () => void;
  isFetching: boolean;
}

// Component nút bấm: Tách riêng để dễ quản lý logic hiển thị
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
      {/* Nút Load More: Chỉ hiện khi đang mở và còn trang */}
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
        <span className="flex">
          {isOpen ? (
            <>
              <IoIosArrowUp /> Hide
            </>
          ) : (
            <>
              <IoIosArrowDown /> {cmt.replyCount} replies
            </>
          )}
        </span>
      </button>
    </div>
  );
};

export default ReplyBtns;
