/** @format */

// input
export interface ChangePasswordArgs {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
  isLogoutOthers: boolean;
}

// response
export interface ChangePasswordResponse {
  accessToken: string;
}
