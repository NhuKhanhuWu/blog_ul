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
  username: string;
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

// otp
export interface EmailOtpArgs {
  otp: string;
  email: string;
}

export interface OtpVerificationResponse {
  token: string;
}

// ---- sign up api's response: start -----
// password
export interface SignUpPasswordArgs {
  username: string;
  token: string;
  password: string;
  passwordConfirm: string;
}
// ---- sign up api's response: end -----

// auth form fields interface
export interface Props<T extends FieldValues> {
  register: UseFormRegister<T>;
  control: Control<T>;
  resetField: UseFormResetField<T>;
  errors: FieldErrors<T>;
  isLoading?: boolean;
  fieldName?: string;
}

// ---- forgot password api's response: start -----
export interface ForgotPasswordResetArgs {
  token: string;
  password: string;
  passwordConfirm: string;
}
// ---- forgot password api's response: end -----
