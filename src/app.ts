import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import { container } from "tsyringe";
import { AppDataSource } from "./config";
import { errorMiddleware, loggerMiddleware } from "./middlewares";
import { BookController } from "./modules/book/book.controller";
import { UserController } from "./modules/user/user.controller";

class App {
  public app: express.Application;
  private bookController: BookController;
  private userController: UserController;

  constructor() {
    this.app = express();
    this.initializeDatabase();
    this.initializeMiddlewares();

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
    this.app.set("trust proxy", true);
  }

  private initializeRoutes() {
    this.app.use("/", this.bookController.router, errorMiddleware);
    this.app.use("/", this.userController.router, errorMiddleware);
  }
}

export default new App().app;
