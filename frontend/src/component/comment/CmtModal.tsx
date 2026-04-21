/** @format */

import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Sheet } from "react-modal-sheet";

import styles from "../../styles/component/BlogCmt.module.scss";
import { ICmtMinimize } from "./CmtMinimize";
import CmtForm from "./CmtForm";
import CmtItem from "./CmtItem";

export interface ICmtModal extends ICmtMinimize {
  setSort: Dispatch<SetStateAction<string>>;
  children?: ReactNode;
  blogId: string;
}

function CmtModal({
  isOpen,
  setIsOpen,
  setSort,
  totalCmts,
  cmts,
  children: loadAndErr,
  blogId,
}: ICmtModal) {
  const [isUsingCmtForm, setUsingCmtForm] = useState(false);

  return (
    <Sheet
      className={`${!isOpen ? "hidden" : ""} light`}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}>
      <Sheet.Container className={styles.modalContainer}>
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

        <Sheet.Content className={styles.modalContent}>
          <div className={styles.cmtFormCotainer}>
            <CmtForm
              blogId={blogId}
              isUsing={isUsingCmtForm}
              setIsUsing={setUsingCmtForm}
            />
          </div>

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
