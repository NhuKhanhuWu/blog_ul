/** @format */

import axios from "axios";

export async function getBlogList(query: string) {
  try {
    const data = await axios.get(`${process.env.SERVER_URL}/api/v1/${query}`);
    console.log(query);

    return data;
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error ? err.message : "Unknown error occurred",
    );
  }
}
