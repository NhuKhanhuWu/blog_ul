/** @format */

import axios from "axios";

export async function getBlogs(query: string) {
  try {
    const data = await axios.get(
      `${process.env.VITE_SERVER_URL}/api/v1/blog/${query}`,
    );

    return data;
  } catch (err: unknown) {
    throw new Error(
      err instanceof Error ? err.message : "Unknown error occurred",
    );
  }
}
