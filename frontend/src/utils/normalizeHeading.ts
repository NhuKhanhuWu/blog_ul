/** @format */

import {
  IBlogDetail,
  IContentBlock,
  INormalizedBlog,
  NormalizedContent,
} from "../interface/blog";

function normalizeHeading(item: IContentBlock): NormalizedContent {
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

function normalizeBlog(blog: IBlogDetail): INormalizedBlog {
  return {
    ...blog,
    content: blog.content.map(normalizeHeading),
  };
}

export default normalizeBlog;
