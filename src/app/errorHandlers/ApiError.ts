class ApiError extends Error {
  constructor(
    public statusCode: number,

    message: string,

    public errorCode?: string,

    public validationErrors: { path?: string; message: string }[] = [],

    public path?: string
  ) {
    super(message);
  }
}

export default ApiError;
