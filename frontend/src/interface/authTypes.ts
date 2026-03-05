/** @format */

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role?: string;
}

export interface IAuthResponse {
  user: IUser | null;
  accessToken: string | null;
}

export interface IAuthState extends IAuthResponse {
  isAuthenticated: boolean;
  isLoading: boolean;
}
export interface ILogin {
  email: string;
  password: string;
}
