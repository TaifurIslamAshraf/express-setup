import httpStatus from "http-status";
import { TErrorMessage, TIErrorResponse } from "../../types/error";

const handleMongooseDuplicateError = (err: Error): TIErrorResponse => {
  const errorField = err.message.split("{")[1].replace("}", "").split(":");
  const path = errorField[0].replace(" ", "").toUpperCase();
  const errorMessages: TErrorMessage[] = [
    {
      path,
      message: `This ${path}${errorField[1]
        .split("/")
        .join("")
        .split(`"`)
        .join("")}is already used.`,
    },
  ];

  return {
    statusCode: httpStatus.BAD_REQUEST,
    message: "Duplicate error",
    errorMessages,
    success: false,
    timestamp: new Date().toISOString(),
  };
};

export default handleMongooseDuplicateError;
