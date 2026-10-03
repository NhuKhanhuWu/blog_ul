/** @format */

import { getBlogImgUploadUrl } from "../../api/controllers/blog/get-blog-img-upload-url.controller";
import { createBlogImageSignedUploadUrl } from "../../api/supabase/uploadImages";

jest.mock("../../api/supabase/uploadImages", () => ({
  createBlogImageSignedUploadUrl: jest.fn(),
}));

describe("getBlogImgUploadUrl", () => {
  const response = { status: jest.fn(), json: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    response.status.mockReturnValue(response);
    response.json.mockReturnValue(response);
  });

  it("returns a signed upload URL for the user's blog image", async () => {
    const uploadData = {
      signedUrl: "https://storage.example/upload",
      token: "upload-token",
      publicUrl: "https://storage.example/image.jpg",
    };
    (createBlogImageSignedUploadUrl as jest.Mock).mockResolvedValue(uploadData);
    const next = jest.fn();

    getBlogImgUploadUrl(
      {
        user: { _id: { toString: () => "user-1" } },
        params: { blogId: "blog-1" },
        body: { name: "image.jpg" },
      } as any,
      response as any,
      next,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(createBlogImageSignedUploadUrl).toHaveBeenCalledWith(
      "user-1",
      "blog-1",
      "image.jpg",
    );
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      status: "success",
      data: uploadData,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated upload requests", async () => {
    const next = jest.fn();

    getBlogImgUploadUrl(
      { params: { blogId: "blog-1" }, body: { name: "image.jpg" } } as any,
      response as any,
      next,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 }),
    );
    expect(createBlogImageSignedUploadUrl).not.toHaveBeenCalled();
  });

  it("rejects requests without a file or blog id", async () => {
    const next = jest.fn();
    const user = { _id: { toString: () => "user-1" } };

    getBlogImgUploadUrl(
      { user, params: { blogId: "blog-1" }, body: undefined } as any,
      response as any,
      next,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: "File required" }),
    );

    next.mockClear();
    getBlogImgUploadUrl(
      { user, params: {}, body: { name: "image.jpg" } } as any,
      response as any,
      next,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: "Blog id required" }),
    );
    expect(createBlogImageSignedUploadUrl).not.toHaveBeenCalled();
  });
});
