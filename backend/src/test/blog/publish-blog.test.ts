/** @format */

import { BlogModel } from "../../api/models/blog.model";
import { publishBlog } from "../../api/controllers/blog/publish-blog.controller";

describe("publishBlog", () => {
  const response = {
    status: jest.fn(),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    response.status.mockReturnValue(response);
    response.json.mockReturnValue(response);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("publishes an owned blog with valid content", async () => {
    const publishedBlog = {
      _id: "blog-1",
      isDraft: false,
    };

    const blog = {
      title: "A valid blog",
      authors: ["Author"],
      categories: [],
      content: [
        {
          type: "paragraph",
          text: "Blog content",
        },
      ],
      isPrivate: false,
      isDraft: true,
      pub_date: null as Date | null,
      save: jest.fn().mockResolvedValue(publishedBlog),
    };

    jest.spyOn(BlogModel, "findOne").mockResolvedValue(blog as any);

    const next = jest.fn();

    await publishBlog(
      {
        params: { id: "blog-1" },
        user: { id: "user-1" },
      } as any,
      response as any,
      next,
    );

    expect(BlogModel.findOne).toHaveBeenCalledWith({
      _id: "blog-1",
      userId: "user-1",
    });

    expect(blog.isDraft).toBe(false);
    expect(blog.pub_date).toBeInstanceOf(Date);
    expect(blog.save).toHaveBeenCalledTimes(1);

    expect(response.status).toHaveBeenCalledWith(200);

    expect(response.json).toHaveBeenCalledWith({
      status: "success",
      message: "Blog published successfully",
      data: publishedBlog,
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("rejects a blog whose content is not ready to publish", async () => {
    const blog = {
      title: "A draft",
      authors: [],
      categories: [],
      content: [],
      isPrivate: false,
      isDraft: true,
      pub_date: null,
      save: jest.fn(),
    };

    jest.spyOn(BlogModel, "findOne").mockResolvedValue(blog as any);

    const next = jest.fn();

    await publishBlog(
      {
        params: { id: "blog-1" },
        user: { id: "user-1" },
      } as any,
      response as any,
      next,
    );

    expect(response.status).toHaveBeenCalledWith(400);

    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "fail",
        message: "Blog is not ready to publish",
        errors: expect.any(Array),
      }),
    );

    expect(blog.isDraft).toBe(true);
    expect(blog.save).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("forwards a not-found error for a missing or unowned blog", async () => {
    jest.spyOn(BlogModel, "findOne").mockResolvedValue(null);

    const next = jest.fn();

    await publishBlog(
      {
        params: { id: "blog-1" },
        user: { id: "user-1" },
      } as any,
      response as any,
      next,
    );

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
      }),
    );
  });
});
