/** @format */

export interface UserPublic {
  _id: string;
  name: string;
  avatar: string;
  slug: string;
}

export interface User extends UserPublic {
  email: string;
  role?: string;
}

export interface AuthResponse {
  user: User | null;
  accessToken: string | null;
}

export interface AuthState extends AuthResponse {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Login {
  email: string;
  password: string;
}
