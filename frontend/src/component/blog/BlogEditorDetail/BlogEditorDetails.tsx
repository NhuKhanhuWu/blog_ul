/** @format */
import { useBlogEditorContext } from "../../../context/BlogEditorContext";
import styles from "./BlogEditorDetail.module.scss";
import CategorySelector from "./CategorySelector";

function BlogEditorDetails() {
  const { blog, updateBlogField } = useBlogEditorContext();

  return (
    <aside className={styles.sidebar}>
      <section>
        <h3>Categories</h3>

        <CategorySelector
          selectedIds={blog.categories}
          maxSelected={50}
          onChange={(categories) => updateBlogField("categories", categories)}
        />
      </section>

      <section>
        <h3>Publication settings</h3>

        <div className={styles.setting}>
          <span>Visibility</span>

          <select
            value={blog.isPrivate ? "private" : "public"}
            onChange={(event) =>
              updateBlogField("isPrivate", event.target.value === "private")
            }>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </section>
    </aside>
  );
}

export default BlogEditorDetails;
