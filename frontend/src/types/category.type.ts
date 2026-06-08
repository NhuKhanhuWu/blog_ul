/** @format */

export interface ICategory {
  _id: string;
  name: string;
  count?: number;
}

export interface ICategories {
  categories: ICategory[];
}

export interface ICategoriesResponse {
  status: string;
  totalResult: number;
  hasNext: boolean;
  data: ICategory[];
}
