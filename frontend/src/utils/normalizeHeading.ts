/** @format */

import {
  IBlogDetail,
  IContentBlock,
  TNormalizedBlog,
  TNormalizedContent,
} from "../interface/blogTypes";

function normalizeHeading(item: IContentBlock): TNormalizedContent {
  const text = item.text || "";

  if (item.heading === 1) {
    return { type: "title", text };
  }

  if (item.heading === 2) {
    return { type: "section", text };
  }

  if (item.heading === 3) {
    return { type: "quote", text };
  }

  if (item.heading === 4) {
    return { type: "highlight", text };
  }

  if (item.heading === 5) {
    return { type: "meta", text };
  }

  return { type: "paragraph", text };
}

function normalizeBlog(blog: IBlogDetail): TNormalizedBlog {
  return {
    ...blog,
    content: blog.content.map(normalizeHeading),
  };
}

export default normalizeBlog;
