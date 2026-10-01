/** @format */
import { BlogDetailProps } from "../../../types/blog.type";
import { ICategory } from "../../../types/category.type";
import styles from "./BlogEditDetail.module.scss";

function BlogDetails({ blog }: { blog: BlogDetailProps }) {
  return (
    <aside className={styles.sidebar}>
      <h2>Blog Details</h2>

      {/* TODO: turn on authors later */}
      {/* <section>
        <h3>Authors</h3>

        <div className={styles.authorList}>
          {blog.authors?.map((author, index) => (
            <span key={`${author}-${index}`} className={styles.author}>
              {author}
            </span>
          ))}

          <button type="button" className={`btn-secondary ${styles.addButton}`}>
            +
          </button>
        </div>
      </section> */}

      <section>
        <h3>Categories</h3>

        <div className={styles.categories}>
          {blog.categories?.map((category: ICategory) => (
            <span key={category?._id} className={styles.category}>
              {category?.name}
            </span>
          ))}

          <button type="button" className={`btn-secondary ${styles.addButton}`}>
            +
          </button>
        </div>
      </section>

      <section>
        <h3>Publication settings</h3>

        <div className={styles.setting}>
          <span>Visibility</span>
          <select>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </section>

      {blog.isDraft && (
        <div className={styles.publishBox}>
          <div className={styles.publishIcon}>➤</div>

          <h3>Ready to publish?</h3>

          <p>Your blog will become publicly visible after publishing.</p>

          <ul>
            <li>✓ Title</li>
            <li>✓ Authors</li>
            <li>✓ Categories</li>
            <li>✓ Content</li>
          </ul>

          <button type="button" className={styles.publishButton}>
            Publish Blog
          </button>

          <button type="button" className={styles.continueButton}>
            Continue Editing
          </button>
        </div>
      )}
    </aside>
  );
}

export default BlogDetails;
