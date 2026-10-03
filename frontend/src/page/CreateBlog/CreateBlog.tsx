/** @format */

import useCreateBlog from "../../hook/blog/useCreateBlog";
import styles from "./CreateBlog.module.scss";

function CreateBlog() {
  const { mutate, isPending, error } = useCreateBlog();

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>Create a blog</h1>

        <p className={styles.description}>
          Start a new draft and continue in the editor.
        </p>

        {error && <p className={styles.error}>{error.message}</p>}

        <button
          type="button"
          className={`btn-primary ${styles.button}`}
          disabled={isPending}
          onClick={() => mutate()}>
          {isPending ? "Creating draft..." : "Create draft"}
        </button>
      </section>
    </main>
  );
}
export default CreateBlog;
