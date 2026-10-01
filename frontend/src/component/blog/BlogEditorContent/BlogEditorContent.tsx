/** @format */

import { BlockNoteView } from "@blocknote/mantine";
import { SuggestionMenuController } from "@blocknote/react";
import { filterSuggestionItems, PartialBlock } from "@blocknote/core";

import { BlogDetailProps } from "../../../types/blog.type";
import { getBlogSlashMenuItems } from "../../../utils/helper/getBlogSlashMenuItems";

import BlogPreview from "../BlogPreview/BlogPreview";
import EditorFooter from "../EditorFooter/EditorFooter";
import BlogDetails from "../BlogEditDetail/BlogEditDetails";
import BlogEditorHeader from "./BlogEditorHeader";

import styles from "./BlogEditorContent.module.scss";
import { useBlogEditor } from "../../../hook/blog/useBlogEditor";

interface BlogEditorContentProps {
  blog: BlogDetailProps;
  initialContent: PartialBlock[];
  theme: "light" | "dark";
  previewOpen: boolean;
  setPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saved: boolean;
  setSaved: React.Dispatch<React.SetStateAction<boolean>>;
}

function BlogEditorContent({
  blog,
  initialContent,
  theme,
  previewOpen,
  setPreviewOpen,
  saved,
  setSaved,
}: BlogEditorContentProps) {
  const {
    editor,
    title,
    setTitle,
    imageCounts,
    handleEditorChange,
    saveDraft,
  } = useBlogEditor({
    blog,
    initialContent,
    setSaved,
  });

  return (
    <>
      <div className={styles.page}>
        <BlogEditorHeader
          saved={saved}
          onPreview={() => setPreviewOpen(true)}
          onSave={saveDraft}
          onPublish={() => {
            // TODO: publish
          }}
        />

        <div className={styles.layout}>
          <main className={styles.editorContainer}>
            <div className={styles.editorCard}>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
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

          <BlogDetails blog={blog} />
        </div>
      </div>

      {previewOpen && (
        <BlogPreview
          title={title}
          editor={editor}
          theme={theme}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}

export default BlogEditorContent;
