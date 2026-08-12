/** @format */

import AppError from "../utils/error/app-error";
import supabase from "./supabase";

const DEFAULT_AVATAR_BUCKET =
  process.env.SUPABASE_AVATAR_BUCKET_NAME || "avatars";
const DEFAULT_BLOG_IMAGE_BUCKET =
  process.env.SUPABASE_BLOG_IMAGE_BUCKET_NAME || "blog-images";

// Safely normalizes the name while preserving the extension
const normalizeFileName = (fileName: string) => {
  const lastDot = fileName.lastIndexOf(".");
  const ext = lastDot !== -1 ? fileName.slice(lastDot).toLowerCase() : "";
  const name = lastDot !== -1 ? fileName.slice(0, lastDot) : fileName;

  const safeName = name
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return `${safeName.slice(0, 80)}${ext}`;
};

// Generates RLS-friendly paths: <userId>/[folder]/<timestamp>-<random>-<filename>
const buildStoragePath = (
  userId: string,
  fileName: string,
  folder?: string,
  prefix?: string,
) => {
  const safeFileName = normalizeFileName(fileName);
  const randomId = Math.random().toString(36).substring(2, 10);
  const baseName = `${Date.now()}-${randomId}-${safeFileName}`;

  // Placing userId first ensures standard Supabase RLS compatibility
  return [userId, folder, prefix, baseName].filter(Boolean).join("/");
};

// helper for public URLs
const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  if (!data?.publicUrl) {
    throw new AppError(
      `Supabase public URL error: missing publicUrl for ${path}`,
      500,
    );
  }
  return data.publicUrl;
};

export interface SignedUploadUrlOptions {
  bucketName?: string;
  userId: string;
  fileName: string;
  folder?: string;
  prefix?: string;
  upsert?: boolean;
}

export interface SignedUploadUrlResult {
  signedUrl: string;
  token: string;
  publicUrl: string;
  bucket: string;
  filePath: string;
}

export const createSignedUploadUrl = async (
  options: SignedUploadUrlOptions,
): Promise<SignedUploadUrlResult> => {
  const bucket = options.bucketName || DEFAULT_AVATAR_BUCKET;
  const filePath = buildStoragePath(
    options.userId,
    options.fileName,
    options.folder,
    options.prefix,
  );

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(filePath, {
      upsert: options.upsert ?? false,
    });

  if (error || !data) {
    throw new AppError(
      `Supabase signed upload URL error: ${error?.message || "Unknown error"}`,
      502,
    );
  }

  const publicUrl = getPublicUrl(bucket, filePath);

  return {
    signedUrl: data.signedUrl,
    token: data.token,
    publicUrl,
    bucket,
    filePath: data.path,
  };
};

export const createAvatarSignedUploadUrl = async (
  userId: string,
  fileName: string,
  options?: Omit<SignedUploadUrlOptions, "userId" | "fileName" | "bucketName">,
): Promise<SignedUploadUrlResult> =>
  createSignedUploadUrl({
    bucketName: DEFAULT_AVATAR_BUCKET,
    userId,
    fileName,
    upsert: true, // Typically true for avatars to overwrite old files
    ...options,
  });

export const createBlogImageSignedUploadUrl = async (
  userId: string,
  fileName: string,
  options?: Omit<SignedUploadUrlOptions, "userId" | "fileName" | "bucketName">,
): Promise<SignedUploadUrlResult> =>
  createSignedUploadUrl({
    bucketName: DEFAULT_BLOG_IMAGE_BUCKET,
    userId,
    fileName,
    ...options,
  });
