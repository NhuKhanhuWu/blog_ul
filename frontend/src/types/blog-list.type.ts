/** @format */

export interface BlogListSimplify {
  _id: string;
  userId: string;
  name: string;
  isPrivate: boolean;
  containsCurrentBlog: boolean;
}

export interface BlogListData {
  _id: string;
  name: string;
  userId: string;
  description: string;
  blogs: string[];
  isPrivate: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
}

export interface BlogListActionInput {
  listId: string;
  blogId: string;
}
