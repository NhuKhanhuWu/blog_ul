/** @format */

import axios from "axios";
import { User, UserPublic } from "../types/auth.type";
import {
  ChangeEmailArgs,
  ChangePasswordArgs,
  ChangePasswordResponse,
} from "../types/user.type";
import {
  GetMyBlogVotesResponse,
  GetMyCmtVotesResponse,
} from "../types/vote.type";
import axiosInstance from "../utils/axios-instance";

interface QueryWithPageArgs {
  page: number;
}

export async function getMe(): Promise<User> {
  const res = await axiosInstance.get("/user/me");

  return res.data.user;
}

export async function getUser(slug: string): Promise<UserPublic> {
  const res = await axiosInstance.get(`/user/${slug}`);

  return res.data;
}

export async function getMyBlogVotes({
  page,
}: QueryWithPageArgs): Promise<GetMyBlogVotesResponse> {
  const res = await axiosInstance.get(`/user/me/my-blog-vote?page=${page}`);

  return res.data;
}

export async function getMyCmtVotes({
  page,
}: QueryWithPageArgs): Promise<GetMyCmtVotesResponse> {
  const res = await axiosInstance.get(`/user/me/my-cmt-vote?page=${page}`);

  return res.data;
}

export async function changePassword(
  changePassData: ChangePasswordArgs,
): Promise<ChangePasswordResponse> {
  const res = await axiosInstance.patch(`/user/change-password`, {
    ...changePassData,
  });

  return res.data;
}

// ---- change email feature ----
export async function changeEmail(changeEmailData: ChangeEmailArgs) {
  const res = await axiosInstance.post("/user/change-email", {
    ...changeEmailData,
  });

  return res.data;
}

export async function changeEmailOtp(
  otp: number,
): Promise<{ accessToken: string }> {
  const res = await axiosInstance.post("/user/change-email/verify", { otp });

  return res.data;
}

// ---- update user feature ----
async function uploadFile(signedUrl: string, avatar: File) {
  try {
    await axios.put(signedUrl, avatar, {
      headers: {
        // Always specify the file MIME type so Supabase serves it correctly
        "Content-Type": avatar.type,
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Upload failed with status code:", error.response?.status);
      console.error("Error response details:", error.response?.data);
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

export async function uploadAvatar(avatar: File): Promise<UserPublic> {
  // get upload url to supabase
  const uploadUrlRes = await axiosInstance.post("/avatar-upload-url", {
    fileName: avatar.name,
  });

  const { signedUrl, publicUrl } = uploadUrlRes.data.data;

  // Upload file directly to Supabase Storage
  await uploadFile(signedUrl, avatar);

  // update avatar url in db
  const updatedUser = await axiosInstance.patch("/user/me", {
    avatar: publicUrl,
  });

  return updatedUser.data;
}
