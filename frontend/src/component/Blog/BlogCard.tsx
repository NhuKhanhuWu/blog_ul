/** @format */

import { IBlogCard } from "../../interface/blog";

function BlogCard({ blog }: IBlogCard) {
  return (
    <div>
      <p>{blog.title}</p>
    </div>
  );
}

export default BlogCard;
