/** @format */

import Popover from "@mui/material/Popover";
import { useState } from "react";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import styles from "./CmtPopover.module.scss";
import DeleteCmtBtn from "../DeleteCmtBtn/DeleteCmtBtn";
import { Cmt } from "../../../types/comment.type";
import { useCmtItem } from "../../../context/CmtItemContext";

function CmtPopover({ cmt }: { cmt: Cmt }) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isOpen = Boolean(anchorEl);
  const { dispatch } = useCmtItem();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <>
      <button onClick={handleClick}>
        <SlOptionsVertical />
      </button>

      <Popover
        id={cmt._id}
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}>
        <div className={styles.popContent}>
          {/* edit cmt */}
          <button
            className={styles.popItem}
            onClick={() => dispatch({ type: "SET_IS_EDIT", payload: true })}>
            <MdEdit className={styles.icon} /> Edit comment
          </button>

          <DeleteCmtBtn cmtId={cmt._id}>
            <button className={styles.popItem}>
              <MdDeleteOutline className={styles.icon} /> Delete comment
            </button>
          </DeleteCmtBtn>
        </div>
      </Popover>
    </>
  );
}

export default CmtPopover;
