/** @format */

import { useCallback, useReducer, useRef } from "react";
import { PartialBlock } from "@blocknote/core";

import { BlogDetailProps, ContentBlock } from "../../types/blog.type";

import useSaveDraft from "./useSaveDraft";
import { useBlogEditorImages } from "./useBlogEditorImages";

/* =========================
   Blog state
========================= */

export interface BlogEditorData {
  title: string;
  content: ContentBlock[];
  categories: string[];
  isPrivate: boolean;
}

export type SaveStatus = "saved" | "unsaved" | "saving" | "error";

type BlogFieldAction = {
  [K in keyof BlogEditorData]: {
    type: "SET_FIELD";
    field: K;
    value: BlogEditorData[K];
  };
}[keyof BlogEditorData];

interface BlogEditorState {
  blog: BlogEditorData;
  saveStatus: SaveStatus;
  revision: number;
  saveRequestId: number;
}

type BlogAction =
  | BlogFieldAction
  | {
      type: "SET_BLOG";
      payload: Partial<BlogEditorData>;
    }
  | { type: "SAVE_STARTED"; requestId: number }
  | { type: "SAVE_SUCCEEDED"; requestId: number; revision: number }
  | { type: "SAVE_FAILED"; requestId: number; revision: number };

function blogReducer(
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
        blog: { ...state.blog, ...action.payload },
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
    case "SAVE_FAILED":
      if (action.requestId !== state.saveRequestId) return state;

      return {
        ...state,
        saveStatus:
          action.revision !== state.revision
            ? "unsaved"
            : action.type === "SAVE_SUCCEEDED"
              ? "saved"
              : "error",
      };

    default:
      return state;
  }
}

/* =========================
   Hook
========================= */

interface UseBlogEditorProps {
  blog: BlogDetailProps;
  initialContent: PartialBlock[];
}

export function useBlogEditor({ blog, initialContent }: UseBlogEditorProps) {
  /* =========================
     Blog state
  ========================= */

  const [state, dispatch] = useReducer(blogReducer, {
    blog: {
      title: blog.title || "",
      content: blog.content || [],
      categories: blog.categories ?? [],
      isPrivate: blog.isPrivate ?? false,
    },
    saveStatus: "saved",
    revision: 0,
    saveRequestId: 0,
  });

  const saveRequestId = useRef(0);

  /* =========================
     Blog field update
  ========================= */

  const updateBlogField = useCallback(
    <K extends keyof BlogEditorData>(field: K, value: BlogEditorData[K]) => {
      dispatch({
        type: "SET_FIELD",
        field,
        value,
      } as BlogFieldAction);
    },
    [],
  );

  const updateBlog = useCallback((data: Partial<BlogEditorData>) => {
    dispatch({
      type: "SET_BLOG",
      payload: data,
    });
  }, []);

  /* =========================
     Editor and images
  ========================= */

  const { editor, imageCounts, getContent } = useBlogEditorImages({
    blog,
    initialContent,
  });

  /* =========================
     Editor changes
  ========================= */

  const handleEditorChange = useCallback(() => {
    updateBlogField("content", getContent());
  }, [getContent, updateBlogField]);

  /* =========================
     Save draft
  ========================= */

  const { mutate } = useSaveDraft();

  const saveDraft = useCallback(() => {
    const content = getContent();

    const payload = {
      blogContent: content,
      id: blog._id,
      categories: state.blog.categories,
      isPrivate: state.blog.isPrivate,
      title: state.blog.title,
    };

    const currentRevision = state.revision;
    const currentRequestId = saveRequestId.current + 1;
    saveRequestId.current = currentRequestId;
    dispatch({ type: "SAVE_STARTED", requestId: currentRequestId });

    mutate(payload, {
      onSuccess: () => {
        dispatch({
          type: "SAVE_SUCCEEDED",
          requestId: currentRequestId,
          revision: currentRevision,
        });
      },
      onError: () => {
        dispatch({
          type: "SAVE_FAILED",
          requestId: currentRequestId,
          revision: currentRevision,
        });
      },
    });
  }, [
    blog._id,
    getContent,
    mutate,
    state.blog.categories,
    state.blog.isPrivate,
    state.blog.title,
    state.revision,
  ]);

  /* =========================
     Return
  ========================= */

  return {
    blog: state.blog,

    isDraft: blog.isDraft,

    saveStatus: state.saveStatus,

    updateBlogField,
    updateBlog,

    editor,
    imageCounts,

    handleEditorChange,

    getContent,
    saveDraft,
  };
}
