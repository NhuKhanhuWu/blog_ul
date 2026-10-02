/** @format */

import { BlogEditorData } from "../reducer/blogEditor.reducer";
import { ICategory } from "../types/category.type";

interface StoredBlogDraft extends Omit<Partial<BlogEditorData>, "categories"> {
  categories?: unknown;
  categoryDetails?: unknown;
}

function isCategory(value: unknown): value is ICategory {
  return (
    typeof value === "object" &&
    value !== null &&
    "_id" in value &&
    typeof value._id === "string" &&
    "name" in value &&
    typeof value.name === "string"
  );
}

function getStorageKey(blogId: string) {
  return `blog-editor:${blogId}`;
}

export function loadBlogDraft(
  blogId: string,
  fallback: BlogEditorData,
): {
  blog: BlogEditorData;
  restored: boolean;
} {
  if (!blogId || typeof window === "undefined") {
    return {
      blog: fallback,
      restored: false,
    };
  }

  try {
    const cached = localStorage.getItem(`blog-editor:${blogId}`);

    if (!cached) {
      return {
        blog: fallback,
        restored: false,
      };
    }

    const saved = JSON.parse(cached) as StoredBlogDraft;
    const savedCategories = Array.isArray(saved.categories)
      ? saved.categories
      : fallback.categories.map((category) => category._id);
    const categoryDetails = new Map<string, ICategory>();

    fallback.categories.forEach((category) => {
      categoryDetails.set(category._id, category);
    });

    if (Array.isArray(saved.categoryDetails)) {
      saved.categoryDetails.filter(isCategory).forEach((category) => {
        categoryDetails.set(category._id, category);
      });
    }

    savedCategories.filter(isCategory).forEach((category) => {
      categoryDetails.set(category._id, category);
    });

    const categories: ICategory[] = savedCategories.flatMap((category) => {
      const categoryId =
        typeof category === "string"
          ? category
          : isCategory(category)
            ? category._id
            : null;

      if (!categoryId) return [];

      return [categoryDetails.get(categoryId) ?? { _id: categoryId, name: "" }];
    });

    const restoredBlog: BlogEditorData = {
      title: typeof saved.title === "string" ? saved.title : fallback.title,

      content: Array.isArray(saved.content) ? saved.content : fallback.content,

      categories,

      isPrivate:
        typeof saved.isPrivate === "boolean"
          ? saved.isPrivate
          : fallback.isPrivate,
    };

    return {
      blog: restoredBlog,
      restored: true,
    };
  } catch {
    return {
      blog: fallback,
      restored: false,
    };
  }
}

export function saveBlogDraftToStorage(blogId: string, blog: BlogEditorData) {
  if (!blogId || typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(
      getStorageKey(blogId),
      JSON.stringify({
        ...blog,
        categories: blog.categories.map((category) => category._id),
        categoryDetails: blog.categories,
      }),
    );
  } catch {
    // Ignore storage errors.
  }
}

export function clearBlogDraftFromStorage(blogId: string) {
  if (!blogId || typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(getStorageKey(blogId));
  } catch {
    // Ignore storage errors.
  }
}
