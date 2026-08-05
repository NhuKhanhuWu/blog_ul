/** @format */

// input
export interface ChangePasswordArgs {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
  isLogoutOthers: boolean;
}

export interface ChangeEmailArgs {
  password: string;
  newEmail: string;
}

// response
export interface ChangePasswordResponse {
  accessToken: string;
}
