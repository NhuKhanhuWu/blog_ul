/** @format */

import { BlogModel } from "../../api/models/blog.model";
import * as blogService from "../../api/services/blog/get-blog.service";
import { getMultBlog } from "../../api/controllers/blog/get-blog.controller";

describe("getMultBlog visibility", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("excludes private and draft blogs even when filtering by profile userId", async () => {
    jest.spyOn(BlogModel, "find").mockReturnValue({} as any);
    jest
      .spyOn(blogService, "sendBlogListResponse")
      .mockResolvedValue(undefined);

    const next = jest.fn();
    await getMultBlog(
      {
        query: { userId: "profile-user-id" },
      } as any,
      {} as any,
      next,
    );

    expect(BlogModel.find).toHaveBeenCalledWith({
      isDraft: { $ne: true },
      isPrivate: { $ne: true },
    });
    expect(next).not.toHaveBeenCalled();
  });
});
