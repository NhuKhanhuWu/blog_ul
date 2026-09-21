/** @format */

import {
  contentBlockSchema,
  contentValidator,
} from "../api/validation/blog.validation";

describe("Blog Content Zod Schemas Testing", () => {
  // 1. Text Block Tests
  describe("Text Block Validation", () => {
    it("should pass for a valid text block", () => {
      const validTextBlock = {
        type: "paragraph",
        text: "Hello, this is a valid paragraph block.",
      };
      const result = contentBlockSchema.safeParse(validTextBlock);
      expect(result.success).toBe(true);
    });

    it("should fail for an empty text block", () => {
      const invalidTextBlock = {
        type: "title",
        text: "",
      };
      const result = contentBlockSchema.safeParse(invalidTextBlock);
      expect(result.success).toBe(false);
    });

    it("should fail if a text block contains a prohibited 'img' field", () => {
      const mixedTextBlock = {
        type: "paragraph",
        text: "Some text",
        img: "https://example.com/image.jpg",
      };
      const result = contentBlockSchema.safeParse(mixedTextBlock);
      expect(result.success).toBe(false);
    });
  });

  // 2. Image Block Tests
  describe("Image Block Validation", () => {
    it("should pass for a valid image block with note", () => {
      const validImageBlock = {
        type: "image",
        img: "https://example.com/photo.png",
        note: "This is a photo caption",
      };
      const result = contentBlockSchema.safeParse(validImageBlock);
      expect(result.success).toBe(true);
    });

    it("should fail for an invalid image URL format", () => {
      const invalidImageBlock = {
        type: "image",
        img: "not-a-valid-url",
      };
      const result = contentBlockSchema.safeParse(invalidImageBlock);
      expect(result.success).toBe(false);
    });

    it("should fail if an image block contains a prohibited 'text' field", () => {
      const mixedImageBlock = {
        type: "image",
        img: "https://example.com/photo.png",
        text: "Some text here",
      };
      const result = contentBlockSchema.safeParse(mixedImageBlock);
      expect(result.success).toBe(false);
    });
  });

  // 3. Array & SuperRefine Tests (contentValidator)
  describe("Content Array Validator", () => {
    it("should fail if the content array is empty", () => {
      const result = contentValidator.safeParse([]);
      expect(result.success).toBe(false);
    });

    it("should fail if the total content length exceeds 50,000 characters", () => {
      const tooLongContentList = [
        {
          type: "paragraph",
          text: "a".repeat(50001), // Vượt quá giới hạn 50k ký tự
        },
      ];
      const result = contentValidator.safeParse(tooLongContentList);
      expect(result.success).toBe(false);
    });

    it("should pass if the total content length is within the limit", () => {
      const validList = [
        {
          type: "paragraph",
          text: "Short paragraph text.",
        },
      ];
      const result = contentValidator.safeParse(validList);
      expect(result.success).toBe(true);
    });
  });
});
