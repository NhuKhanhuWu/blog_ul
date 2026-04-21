/** @format */

import { IToggleVote, IVoteResponse } from "../types/vote.type";
import axiosInstance from "../utils/axios-instance";

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
