/** @format */

import { Dispatch, ReactNode, SetStateAction } from "react";
import { Sheet } from "react-modal-sheet";

import styles from "../../styles/component/BlogCmt.module.scss";
import { ICmtMinimize } from "./CmtMinimize";
import CmtForm from "./CmtForm";
import CmtItem from "./CmtItem";

export interface ICmtModal extends ICmtMinimize {
  setSort: Dispatch<SetStateAction<string>>;
  children?: ReactNode;
}

function CmtModal({
  isOpen,
  setIsOpen,
  setSort,
  totalCmts,
  cmts,
  children: loadAndErr,
}: ICmtModal) {
  return (
    <Sheet
      className={!isOpen ? "hidden" : ""}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}>
      <Sheet.Container className={styles.cmtContainer}>
        <Sheet.Header className={styles.header}>
          {/* <div className={styles.header}> */}
          <p>{totalCmts} comments</p>

          <select name="sort" onChange={(e) => setSort(e.target.value)}>
            <option value="top">Most related</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          {/* </div> */}
        </Sheet.Header>

        <Sheet.Content>
          <CmtForm />

          <div className={styles.cmts}>
            {cmts.map((cmt) => (
              <CmtItem cmt={cmt} key={cmt._id} />
            ))}

            {loadAndErr}
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop />
    </Sheet>
  );
}

export default CmtModal;
