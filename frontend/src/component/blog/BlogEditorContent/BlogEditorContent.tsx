/** @format */

import { BlockNoteView } from "@blocknote/mantine";
import { SuggestionMenuController } from "@blocknote/react";
import { filterSuggestionItems } from "@blocknote/core";

import { getBlogSlashMenuItems } from "../../../utils/helper/getBlogSlashMenuItems";

import BlogPreview from "../BlogPreview/BlogPreview";
import EditorFooter from "../EditorFooter/EditorFooter";
import BlogEditorHeader from "../BlogEditorHeader/BlogEditorHeader";

import styles from "./BlogEditorContent.module.scss";
import { useBlogEditorContext } from "../../../context/BlogEditorContext";
import BlogEditorDetails from "../BlogEditorDetail/BlogEditorDetails";

interface BlogEditorContentProps {
  theme: "light" | "dark";
  previewOpen: boolean;
  setPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function BlogEditorContent({
  theme,
  previewOpen,
  setPreviewOpen,
}: BlogEditorContentProps) {
  const { editor, blog, updateBlogField, imageCounts, handleEditorChange } =
    useBlogEditorContext();

  return (
    <>
      <div className={styles.page}>
        <BlogEditorHeader onPreview={() => setPreviewOpen(true)} />

        <div className={styles.layout}>
          <main className={styles.editorContainer}>
            <div className={styles.editorCard}>
              <input
                value={blog.title}
                onChange={(event) =>
                  updateBlogField("title", event.target.value)
                }
                className={styles.titleInput}
                placeholder="Write your title..."
              />

              <div className={styles.divider} />

              <div className={styles.blockEditor}>
                <BlockNoteView
                  editor={editor}
                  editable
                  theme={theme}
                  slashMenu={false}
                  onChange={handleEditorChange}>
                  <SuggestionMenuController
                    triggerCharacter="/"
                    getItems={async (query) =>
                      filterSuggestionItems(
                        getBlogSlashMenuItems(editor),
                        query,
                      )
                    }
                  />
                </BlockNoteView>
              </div>
            </div>

            <EditorFooter editor={editor} imageCounts={imageCounts} />
          </main>

          <BlogEditorDetails />
        </div>
      </div>

      {previewOpen && (
        <BlogPreview
          title={blog.title}
          editor={editor}
          theme={theme}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}

export default BlogEditorContent;
