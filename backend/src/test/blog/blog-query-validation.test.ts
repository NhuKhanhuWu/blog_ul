/** @format */

import { getMyBlogsSchema } from "../../api/validation/blog-query.validation";

describe("getMyBlogsSchema", () => {
  it("accepts a draft filter and supported sort", () => {
    const result = getMyBlogsSchema.safeParse({
      query: {
        isDraft: "true",
        sort: "-upVotes",
        page: "1",
        limit: "20",
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.query).toEqual({
        isDraft: true,
        sort: "-upVotes",
        page: 1,
        limit: 20,
      });
    }
  });

  it("rejects unsupported sorts, invalid pagination, and conflicting status filters", () => {
    expect(
      getMyBlogsSchema.safeParse({
        query: { sort: "-createdAt" },
      }).success,
    ).toBe(false);
    expect(
      getMyBlogsSchema.safeParse({
        query: { limit: "21" },
      }).success,
    ).toBe(false);
    expect(
      getMyBlogsSchema.safeParse({
        query: { isDraft: "false", status: "published" },
      }).success,
    ).toBe(false);
  });
});
