/** @format */

import Popover from "@mui/material/Popover";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import styles from "./HistoryActionPopover.module.scss";

interface HistoryActionPopoverProps {
  onDelete: () => void;
  deleteLabel?: string;
}

function HistoryActionPopover({
  onDelete,
  deleteLabel = "Delete",
}: HistoryActionPopoverProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isOpen = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleDelete() {
    onDelete();
    handleClose();
  }

  return (
    <>
      <button
        type="button"
        className={styles.popBtn}
        onClick={handleClick}
        aria-label="Open history actions">
        <SlOptionsVertical />
      </button>

      <Popover
        open={isOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        slotProps={{
          root: {
            style: { zIndex: 9999 },
          },
        }}>
        <div className={styles.popContent}>
          <button className={styles.popItem} onClick={handleDelete}>
            <MdDeleteOutline className={styles.icon} /> {deleteLabel}
          </button>
        </div>
      </Popover>
    </>
  );
}

export default HistoryActionPopover;
