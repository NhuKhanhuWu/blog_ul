/** @format */

import { BlogDetailProps, ContentBlock } from "../types/blog.type";
import { ICategory } from "../types/category.type";

export interface BlogEditorData {
  title: string;
  content: ContentBlock[];
  categories: ICategory[];
  isPrivate: boolean;
}

export type SaveStatus = "saved" | "unsaved" | "saving" | "error";

export interface BlogEditorState {
  blog: BlogEditorData;
  saveStatus: SaveStatus;
  revision: number;
  saveRequestId: number;
}

export type BlogFieldAction = {
  [K in keyof BlogEditorData]: {
    type: "SET_FIELD";
    field: K;
    value: BlogEditorData[K];
  };
}[keyof BlogEditorData];

export type BlogAction =
  | BlogFieldAction
  | {
      type: "SET_BLOG";
      payload: Partial<BlogEditorData>;
    }
  | {
      type: "SAVE_STARTED";
      requestId: number;
    }
  | {
      type: "SAVE_SUCCEEDED";
      requestId: number;
      revision: number;
    }
  | {
      type: "SAVE_FAILED";
      requestId: number;
      revision: number;
    };

export function createInitialBlogData(blog: BlogDetailProps): BlogEditorData {
  return {
    title: blog.title || "",
    content: blog.content || [],
    categories: (blog.categories ?? []).map((category) =>
      typeof category === "string" ? { _id: category, name: "" } : category,
    ),
    isPrivate: blog.isPrivate ?? false,
  };
}

export function createInitialEditorState(
  blog: BlogDetailProps,
): BlogEditorState {
  return {
    blog: createInitialBlogData(blog),
    saveStatus: "saved",
    revision: 0,
    saveRequestId: 0,
  };
}

export function blogReducer(
  state: BlogEditorState,
  action: BlogAction,
): BlogEditorState {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        blog: {
          ...state.blog,
          [action.field]: action.value,
        },
        saveStatus: "unsaved",
        revision: state.revision + 1,
      };

    case "SET_BLOG":
      return {
        ...state,
        blog: {
          ...state.blog,
          ...action.payload,
        },
        saveStatus: "unsaved",
        revision: state.revision + 1,
      };

    case "SAVE_STARTED":
      return {
        ...state,
        saveStatus: "saving",
        saveRequestId: action.requestId,
      };

    case "SAVE_SUCCEEDED":
    case "SAVE_FAILED": {
      if (action.requestId !== state.saveRequestId) {
        return state;
      }

      const isLatestRevision = action.revision === state.revision;

      return {
        ...state,
        saveStatus: !isLatestRevision
          ? "unsaved"
          : action.type === "SAVE_SUCCEEDED"
            ? "saved"
            : "error",
      };
    }

    default:
      return state;
  }
}
