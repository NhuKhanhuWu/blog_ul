/** @format */
import { BlogModel } from "../../api/models/blog.model";
import { createBlog } from "../../api/controllers/blog/create-blog.controller";

jest.mock("../../api/models/blog.model", () => ({
  BlogModel: { create: jest.fn() },
}));

describe("createBlog", () => {
  const response = { status: jest.fn(), json: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    response.status.mockReturnValue(response);
    response.json.mockReturnValue(response);
  });

  it("creates a draft for the authenticated user", async () => {
    const blog = { _id: "blog-1", isDraft: true };
    (BlogModel.create as jest.Mock).mockResolvedValue(blog);
    const next = jest.fn();

    await createBlog(
      { accessToken: "access-token", user: { id: "user-1" } } as any,
      response as any,
      next,
    );

    expect(BlogModel.create).toHaveBeenCalledWith({
      userId: "user-1",
      isDraft: true,
      content: [],
      authors: [],
      categories: [],
    });
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      status: "success",
      data: blog,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards database errors to Express", async () => {
    const error = new Error("database unavailable");
    (BlogModel.create as jest.Mock).mockRejectedValue(error);
    const next = jest.fn();

    await createBlog({ user: { id: "user-1" } } as any, response as any, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
