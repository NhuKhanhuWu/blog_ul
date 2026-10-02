/** @format */
import { BlogModel } from "../../api/models/blog.model";
import { updateBlog } from "../../api/controllers/blog/update-blog.controller";

jest.mock("../../api/models/blog.model", () => ({
  BlogModel: { findOneAndUpdate: jest.fn() },
}));

describe("updateBlog", () => {
  const response = { status: jest.fn(), json: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    response.status.mockReturnValue(response);
    response.json.mockReturnValue(response);
  });

  it("updates an owned blog and keeps it as a draft", async () => {
    const updatedBlog = { _id: "blog-1", title: "Updated title" };
    (BlogModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedBlog);
    const next = jest.fn();

    updateBlog(
      {
        params: { id: "blog-1" },
        user: { _id: "user-1" },
        body: { title: "Updated title" },
      } as any,
      response as any,
      next,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(BlogModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "blog-1", userId: "user-1" },
      { $set: { title: "Updated title", isDraft: true } },
      { new: true, runValidators: true },
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      status: "success",
      data: updatedBlog,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards a not-found error when the blog is missing or not owned", async () => {
    (BlogModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);
    const next = jest.fn();

    updateBlog(
      {
        params: { id: "blog-1" },
        user: { _id: "user-1" },
        body: { title: "Updated title" },
      } as any,
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
