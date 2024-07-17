import express, { Application, Response } from "express";
import globalErrorhandler from "./app/middlewares/globalErrorHandler";
import { notFoundRoute } from "./app/middlewares/notFoundRoute";

import middlewares from "./app/config/middlewares";
import router from "./app/routes";
const app: Application = express();

//all middlewares
middlewares(app);

// test endpint
app.use("/api/v1", (_, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server Working !",
  });
});

// api endpoints
app.use("/api/v1", router);

// Global error handler
app.use(globalErrorhandler);

// handle not found route
app.use(notFoundRoute);

export default app;
