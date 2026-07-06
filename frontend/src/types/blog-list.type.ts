/** @format */
import * as yup from "yup";
import { BlogSimplify } from "./blog.type";

export interface BlogListSimplify {
  _id: string;
  userId: string;
  name: string;
  isPrivate: boolean;
  containsCurrentBlog: boolean;
  blogsCnt: number;
  listAvatar: string | null;
  isDefault: boolean;
}

export interface BlogListData extends BlogListSimplify {
  description?: string;
  blogs: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogListActionInput {
  listId: string;
  blogId: string;
}

// Create list
//  Define the main form schema using .when()
export const blogListFormSchema = yup.object({
  // isUpdating: yup.boolean().required(),

  blogList: yup.object({
    name: yup
      .string()
      .required("Blog list name is required")
      .max(100, "Max lenght for name is 100"),
    description: yup
      .string()
      .optional()
      .max(500, "Max lenght for description is 500"),
    isPrivate: yup
      .boolean()
      .transform((value, originalValue) => {
        if (typeof originalValue === "string") {
          return originalValue === "true";
        }
        return value;
      })
      .required("Privacy setting is required"),
  }),
});

export interface CreateListProps {
  name: string;
  description?: string;
  isPrivate: boolean;
}

export interface CreateListRes {
  _id: string;
  name: string;
  description: string;
  isPrivate: boolean;
  isDefault: boolean;
}

export interface UpdateBlogListProps {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

export interface UpdateBlogListArgs {
  blogListId: string;
  data: UpdateBlogListProps;
}

export interface GetBlogFromListArgs {
  nextPage: number | null;
  amount: number;
  data: {
    blogs: BlogSimplify[];
  };
}
export interface BlogListPopOverProps {
  blogList: BlogListSimplify;
}
