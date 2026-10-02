/** @format */

import { useCallback, useEffect, useReducer, useRef } from "react";
import { PartialBlock } from "@blocknote/core";

import { BlogDetailProps } from "../../types/blog.type";

import useSaveDraft from "./useSaveDraft";
import { useBlogEditorImages } from "./useBlogEditorImages";

import {
  blogReducer,
  createInitialBlogData,
  BlogFieldAction,
  BlogEditorData,
  BlogEditorState,
} from "../../reducer/blogEditor.reducer";

import {
  loadBlogDraft,
  saveBlogDraftToStorage,
} from "../../storage/blogEditor.storage";

import { convertToBlockNoteBlocks } from "../../utils/helper/convertToBlockNoteBlocks";
import { useBlogAutosave } from "./useBlogAutosave";

interface UseBlogEditorProps {
  blog: BlogDetailProps;
  initialContent: PartialBlock[];
}

function initializeBlogEditor(blog: BlogDetailProps): BlogEditorState {
  const initialBlog = createInitialBlogData(blog);

  const { blog: restoredBlog, restored } = loadBlogDraft(blog._id, initialBlog);

  return {
    blog: restoredBlog,
    saveStatus: restored ? "unsaved" : "saved",
    revision: 0,
    saveRequestId: 0,
  };
}

export function useBlogEditor({ blog, initialContent }: UseBlogEditorProps) {
  /* =========================
     Initial state
  ========================= */

  const [state, dispatch] = useReducer(blogReducer, blog, initializeBlogEditor);

  const saveRequestId = useRef(0);

  /* =========================
     Local storage
  ========================= */

  useEffect(() => {
    if (!blog._id || state.revision === 0) {
      return;
    }

    saveBlogDraftToStorage(blog._id, state.blog);
  }, [blog._id, state.blog, state.revision]);

  /* =========================
     Blog updates
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
     Editor
  ========================= */

  const editorContent = state.blog.content.length
    ? convertToBlockNoteBlocks(state.blog.content)
    : initialContent;

  const editorBlog = {
    ...blog,
    content: state.blog.content,
  };

  const { editor, imageCounts, getContent } = useBlogEditorImages({
    blog: editorBlog,
    initialContent: editorContent,
  });

  const handleEditorChange = useCallback(() => {
    updateBlogField("content", getContent());
  }, [getContent, updateBlogField]);

  /* =========================
     Save draft
  ========================= */

  const { mutate } = useSaveDraft();

  // manually
  const saveDraft = useCallback(() => {
    const content = getContent();

    const revision = state.revision;

    const requestId = saveRequestId.current + 1;
    saveRequestId.current = requestId;

    dispatch({
      type: "SAVE_STARTED",
      requestId,
    });

    mutate(
      {
        id: blog._id,
        title: state.blog.title,
        blogContent: content,
        categories: state.blog.categories.map((category) => category._id),
        isPrivate: state.blog.isPrivate,
      },
      {
        onSuccess: () => {
          dispatch({
            type: "SAVE_SUCCEEDED",
            requestId,
            revision,
          });
        },

        onError: () => {
          dispatch({
            type: "SAVE_FAILED",
            requestId,
            revision,
          });
        },
      },
    );
  }, [blog._id, getContent, mutate, state.blog, state.revision]);

  // auto
  useBlogAutosave({
    revision: state.revision,
    save: saveDraft,
    debounce: 15_000,
    maxWait: 60_000,
  });

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
