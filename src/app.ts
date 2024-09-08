import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { container } from "tsyringe";
import { AppDataSource } from "./config";
import { errorMiddleware, loggerMiddleware } from "./middlewares";
import { BookController } from "./modules/book/book.controller";
import { UserController } from "./modules/user/user.controller";
// import { CacheService } from "./modules/cache/cache.service";
import rateLimit from "express-rate-limit";

class App {
  public app: express.Application;
  private bookController: BookController;
  private userController: UserController;
  // private cacheService: CacheService;

  // Rate limiter for GET requests
  private getLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 GET requests per windowMs
    message: "Too many GET requests from this IP, please try again later",
  });

  // Rate limiter for POST requests
  private postLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 POST requests per windowMs
    message: "Too many POST requests from this IP, please try again later",
  });

  // Rate limiter for other HTTP methods (e.g., PUT, DELETE)
  private defaultLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests for other methods per windowMs
    message: "Too many requests from this IP, please try again later",
  });

  constructor() {
    this.app = express();
    this.initializeDatabase();
    this.initializeMiddlewares();

    // this.cacheService = container.resolve(CacheService);
    this.userController = container.resolve(UserController);
    this.bookController = container.resolve(BookController);

    this.initializeRoutes();

    // Global error handling middleware
    this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      return res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
      });
    });
  }

  private initializeDatabase() {
    AppDataSource.initialize()
      .then(() => {
        console.log("Data Source has been initialized!");
      })
      .catch((err) => {
        console.error("Error during Data Source initialization:", err);
      });
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
    this.app.use(helmet());
    this.app.use(loggerMiddleware);
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      switch (req.method) {
        case "GET":
          return this.getLimiter(req, res, next);
        case "POST":
          return this.postLimiter(req, res, next);
        default:
          return this.defaultLimiter(req, res, next);
      }
    });
    // this.app.set("trust proxy", true);
  }

  private initializeRoutes() {
    this.app.use("/", this.bookController.router, errorMiddleware);
    this.app.use("/", this.userController.router, errorMiddleware);
  }
}

export default new App().app;
