/** @format */

export interface IApiError {
  status: string;
  message: string;
  error: {
    statusCode: number;
    status: string;
    isOperational: boolean;
  };
}
