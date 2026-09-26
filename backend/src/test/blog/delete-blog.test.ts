/** @format */

import { BlogModel } from "../../api/models/blog.model";
import { deleteBlog } from "../../api/controllers/blog/delete-blog.controller";

jest.mock("../../api/models/blog.model", () => ({
  BlogModel: { findOneAndDelete: jest.fn() },
}));

describe("deleteBlog", () => {
  const response = { status: jest.fn(), json: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    response.status.mockReturnValue(response);
    response.json.mockReturnValue(response);
  });

  it("deletes only the requested user's blog", async () => {
    (BlogModel.findOneAndDelete as jest.Mock).mockResolvedValue({
      _id: "blog-1",
    });
    const next = jest.fn();

    deleteBlog(
      { params: { id: "blog-1" }, user: { _id: "user-1" } } as any,
      response as any,
      next,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(BlogModel.findOneAndDelete).toHaveBeenCalledWith({
      _id: "blog-1",
      userId: "user-1",
    });
    expect(response.status).toHaveBeenCalledWith(204);
    expect(response.json).toHaveBeenCalledWith({
      status: "success",
      data: null,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards a not-found error when the blog is missing or not owned", async () => {
    (BlogModel.findOneAndDelete as jest.Mock).mockResolvedValue(null);
    const next = jest.fn();

    deleteBlog(
      { params: { id: "blog-1" }, user: { _id: "user-1" } } as any,
      response as any,
      next,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404 }),
    );
    expect(response.status).not.toHaveBeenCalled();
  });
});
