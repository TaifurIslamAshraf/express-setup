import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { TErrorMessages, TIErrorResponse } from "../../types/error";
import config from "../config/config";
import ApiError from "../errorHandlers/ApiError";
import handleApiError from "../errorHandlers/handleApiError";
import handleMongooseCastError from "../errorHandlers/handleMongooseCastError";
import handleMongooseDuplicateError from "../errorHandlers/handleMongooseDuplicateError";
import handleMongooseValidationError from "../errorHandlers/handleMongooseValidationError";
import handleZodError from "../errorHandlers/handleZodError";
import { errorLogger } from "../utils/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const globalErrorhandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message =
    "Something went wrong. Please try again later or contact to the support";
  let errorMessages: TErrorMessages[] = [{ path: "", message }];

  // Add request tracking
  const errorId = Date.now().toString();
  const requestInfo = {
    id: errorId,
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  };

  // Enhanced error logging
  errorLogger("Error occurred:", {
    errorId,
    error: err,
    request: requestInfo,
  });

  if (err.name === "ValidationError") {
    const modifiedError: TIErrorResponse = handleMongooseValidationError(err);
    message = modifiedError.message;
    statusCode = modifiedError.statusCode;
    errorMessages = modifiedError.errorMessages;
  } else if (err.name === "CastError") {
    const modifiedError: TIErrorResponse = handleMongooseCastError(err);
    message = modifiedError.message;
    statusCode = modifiedError.statusCode;
    errorMessages = modifiedError.errorMessages;
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    const modifiedError: TIErrorResponse = handleMongooseDuplicateError(err);
    message = modifiedError.message;
    statusCode = modifiedError.statusCode;
    errorMessages = modifiedError.errorMessages;
  } else if (err instanceof ZodError) {
    const modifiedError: TIErrorResponse = handleZodError(err);
    message = modifiedError.message;
    statusCode = modifiedError.statusCode;
    errorMessages = modifiedError.errorMessages;
  } else if (err instanceof ApiError) {
    const modifiedError: TIErrorResponse = handleApiError(err);
    message = modifiedError.message;
    statusCode = modifiedError.statusCode;
    errorMessages = modifiedError.errorMessages;
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: config.app.env === "development" ? err.stack : undefined,
  });
};

export default globalErrorhandler;
