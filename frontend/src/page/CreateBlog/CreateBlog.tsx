/** @format */

import useCreateBlog from "../../hook/blog/useCreateBlog";

function CreateBlog() {
  const { mutate, isPending, error } = useCreateBlog();

  return (
    <main>
      <h1>Create a blog</h1>
      <p>Start a new draft and continue in the editor.</p>
      {error && <p className="error-mgs">{error.message}</p>}
      <button
        type="button"
        className={`btn-primary ${isPending ? "disabled" : ""}`}
        disabled={isPending}
        onClick={() => mutate()}>
        {isPending ? "Creating draft..." : "Create draft"}
      </button>
    </main>
  );
}

export default CreateBlog;
