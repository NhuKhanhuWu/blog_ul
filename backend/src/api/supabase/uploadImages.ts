/** @format */

import AppError from "../utils/error/app-error";
import supabase from "./supabase";

const DEFAULT_AVATAR_BUCKET =
  process.env.SUPABASE_AVATAR_BUCKET_NAME || "avatars";

const DEFAULT_BLOG_IMAGE_BUCKET =
  process.env.SUPABASE_BLOG_IMAGE_BUCKET_NAME || "blog-images";

const BLOG_TEMP_FOLDER = "temp";
const BLOG_PUBLISH_FOLDER = "publish";

export interface SignedUploadUrlOptions {
  bucketName: string;
  filePath: string;
  upsert?: boolean;
}

export interface SignedUploadUrlResult {
  signedUrl: string;
  token: string;
  publicUrl: string;
  bucket: string;
  filePath: string;
}

/**
 * Safely normalizes a file name while preserving its extension.
 */
const normalizeFileName = (fileName: string): string => {
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

/**
 * Generates a unique file name.
 *
 * Example:
 * 1727261234567-a8f31c2d-photo.webp
 */
const generateUniqueFileName = (fileName: string): string => {
  const safeFileName = normalizeFileName(fileName);

  const randomId = Math.random().toString(36).substring(2, 10);

  return `${Date.now()}-${randomId}-${safeFileName}`;
};

/**
 * Get public URL for a Supabase Storage file.
 */
const getPublicUrl = (bucket: string, filePath: string): string => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new AppError(
      `Supabase public URL error: missing publicUrl for ${filePath}`,
      500,
    );
  }

  return data.publicUrl;
};

/**
 * Common helper.
 *
 * This function ONLY communicates with Supabase Storage.
 * Path generation is handled by specific upload functions.
 */
export const createSignedUploadUrl = async (
  options: SignedUploadUrlOptions,
): Promise<SignedUploadUrlResult> => {
  const { bucketName, filePath, upsert = false } = options;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUploadUrl(filePath, {
      upsert,
    });

  if (error || !data) {
    throw new AppError(
      `Supabase signed upload URL error: ${error?.message || "Unknown error"}`,
      502,
    );
  }

  return {
    signedUrl: data.signedUrl,
    token: data.token,
    publicUrl: getPublicUrl(bucketName, filePath),
    bucket: bucketName,
    filePath: data.path,
  };
};

/**
 * Create signed upload URL for user avatar.
 *
 * Path:
 * {userId}/avatar
 */
export const createAvatarSignedUploadUrl = async (
  userId: string,
): Promise<SignedUploadUrlResult> => {
  const filePath = `${userId}/avatar`;

  return createSignedUploadUrl({
    bucketName: DEFAULT_AVATAR_BUCKET,
    filePath,
    upsert: true,
  });
};

/**
 * Create signed upload URL for blog image.
 *
 * All newly uploaded blog images are stored in temp.
 *
 * Path:
 * {userId}/{blogId}/temp/{uniqueFileName}
 */
export const createBlogImageSignedUploadUrl = async (
  userId: string,
  blogId: string,
  fileName: string,
): Promise<SignedUploadUrlResult> => {
  const uniqueFileName = generateUniqueFileName(fileName);

  const filePath = [userId, blogId, BLOG_TEMP_FOLDER, uniqueFileName].join("/");

  return createSignedUploadUrl({
    bucketName: DEFAULT_BLOG_IMAGE_BUCKET,
    filePath,
    upsert: false,
  });
};

/**
 * Move a blog image from temp to publish.
 *
 * This happens directly inside Supabase Storage.
 * The image does NOT need to be downloaded and uploaded again.
 *
 * From:
 * {userId}/{blogId}/temp/{fileName}
 *
 * To:
 * {userId}/{blogId}/publish/{fileName}
 */
export const moveBlogImageToPublish = async (
  userId: string,
  blogId: string,
  fileName: string,
) => {
  const fromPath = [userId, blogId, BLOG_TEMP_FOLDER, fileName].join("/");

  const toPath = [userId, blogId, BLOG_PUBLISH_FOLDER, fileName].join("/");

  const { error } = await supabase.storage
    .from(DEFAULT_BLOG_IMAGE_BUCKET)
    .move(fromPath, toPath);

  if (error) {
    throw new AppError(`Failed to move blog image: ${error.message}`, 502);
  }

  return {
    fromPath,
    toPath,
    publicUrl: getPublicUrl(DEFAULT_BLOG_IMAGE_BUCKET, toPath),
  };
};
