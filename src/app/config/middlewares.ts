import compression from "compression";
import cookieParser from "cookie-parser";
import cors, { CorsOptions } from "cors";
import ejs from "ejs";
import express, { Application } from "express";
import userAgent from "express-useragent";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import requestIp from "request-ip";
import enableCrossOriginResourcePolicy from "../middlewares/enableCrossOriginResourcePolicy";
import sendResponse from "../utilities/sendResponse";
import config from "./config";

const middlewares = (app: Application) => {
  const corsOptions: CorsOptions = {
    origin:
      config.app.env === "production"
        ? config.cors.allowedOrigins
        : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  };

  if (config.app.env === "production") {
    app.set("trust proxy", 1);
  }

  // Middlewares
  app.set("view engine", ejs);
  // app.use(session(sessionOptions));
  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));
  app.use(compression());
  app.use(cookieParser());
  app.use(userAgent.express());
  app.use(requestIp.mw());
  if (config.app.env === "development") {
    app.use(morgan("dev"));
  }

  // Root route
  app.get("/api/v1", (req, res) => {
    sendResponse(res, {
      statusCode: 200,
      message: "Server sunning successfully.",
    });
  });

  // static files
  const uploadsPath = path.join(__dirname, "..", "public/uploads");
  app.use(
    "/public/uploads",
    enableCrossOriginResourcePolicy,
    express.static(uploadsPath)
  );
};

export default middlewares;
