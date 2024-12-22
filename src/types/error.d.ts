export type TErrorMessages = {
  path: string;
  message: string;
};

export interface TIErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  errorMessages: {
    path: string;
    message: string;
    code?: string;
  }[];
  stack?: string;
  timestamp: string;
}
