/** @format */

import { IToggleVote, IVoteResponse } from "../interface/voteTypes";
import axiosInstance from "../utils/axiosInstance";

export async function toggleVote({
  targetId,
  voteType,
  targetType,
}: IToggleVote): Promise<IVoteResponse> {
  const response = await axiosInstance.post("/votes", {
    targetId,
    voteType,
    targetType,
  });

  return response.data;
}
