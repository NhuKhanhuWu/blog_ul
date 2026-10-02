/** @format */

import { BlockNoteEditor } from "@blocknote/core";
import { countBlockCharacters } from "../../../utils/helper/count-block-characters";
import styles from "./EditorFooter.module.scss";

export interface EditorImageCounts {
  embedded: number;
  uploaded: number;
}

function EditorFooter({
  editor,
  imageCounts,
}: {
  editor: BlockNoteEditor;
  imageCounts: EditorImageCounts;
}) {
  const characters = countBlockCharacters(editor.document);

  return (
    <footer className={styles.footer}>
      <p>Unpublished draft images (uploaded) expire in 7 days.</p>

      <div className={styles.stats}>
        <span>{characters.toLocaleString()} / 50,000 characters</span>
        <span>
          {imageCounts.embedded} / 100 embedded · {imageCounts.uploaded} / 5
          uploaded
        </span>
      </div>
    </footer>
  );
}

export default EditorFooter;
