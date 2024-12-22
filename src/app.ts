import globalErrorhandler from "@/app/middlewares/globalErrorHandler";
import { notFoundRoute } from "@/app/middlewares/notFoundRoute";
import express, { Application, Response } from "express";

import middlewares from "@/app/config/middlewares";
import router from "@/app/routes";
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

app.get("/health", (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  res.send(healthcheck);
});

// api endpoints
app.use("/api/v1", router);

// Global error handler
app.use(globalErrorhandler);

// handle not found route
app.use(notFoundRoute);

export default app;
