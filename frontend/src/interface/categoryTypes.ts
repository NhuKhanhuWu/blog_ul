/** @format */

export interface ICategory {
  _id: string;
  name: string;
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
