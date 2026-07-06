/** @format */

import {
  Control,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  UseFormResetField,
} from "react-hook-form";

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

// ---- sign up -----
// otp
export interface SignUpOtpArgs {
  otp: string;
  email: string;
}

export interface SignUpOtpResponse {
  token: string;
}

// password
export interface SignUpPasswordArgs {
  username: string;
  token: string;
  password: string;
  passwordConfirm: string;
}

// auth form fields interface
export interface Props<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  resetField: UseFormResetField<T>;
  errors: FieldErrors<T>;
  isLoading?: boolean;
  fieldName?: string;
}
