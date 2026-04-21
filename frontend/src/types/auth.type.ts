/** @format */

export interface IUserPublic {
  _id: string;
  name: string;
  avatar: string;
}

export interface IUser extends IUserPublic {
  email: string;
  role?: string;
}

export interface IAuthResponse {
  user: IUser | null;
  accessToken: string | null;
}

export interface IAuthState extends IAuthResponse {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ILogin {
  email: string;
  password: string;
}
