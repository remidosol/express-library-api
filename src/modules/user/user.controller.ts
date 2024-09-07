import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "tsyringe";
import { UserService } from "./user.service";
import { BadRequestException } from "../../exceptions/http-exceptions";
import { errorMiddleware, serializerMiddleware, validationMiddleware } from "../../middlewares";
import { UserDTO, CreateUserDTO, ReturnBookDTO } from "./dto";
import { User } from "./entities";

@injectable()
export class UserController {
  public router: Router;

  constructor(@inject(UserService) private userService: UserService) {
    this.router = Router();
    this.routes();
  }

  public async getUsers(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await this.userService.getUsers();

      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      next(err);
      // res.status(500).json({ message: "Server error" });
    }
  }

  public getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.userId);

      if (!userId || isNaN(userId)) {
        throw new BadRequestException("Invalid user ID");
      }

      const user = await this.userService.getUserWithBooks(userId);
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      next(err);
      // res.status(500).json({ message: "Server error" });
    }
  };

  public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name } = req.body;

    try {
      await this.userService.createUser(name);
      res.status(204).send();
    } catch (err) {
      // console.log(JSON.stringify((err as any).driverError, null, 2));
      // console.error(err);
      next(err);
      // res.status(500).json({ message: "Server error" });
    }
  }

  public async borrowBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = +req.params.userId;
      const bookId = +req.params.bookId;

      if (!userId || isNaN(userId)) {
        throw new BadRequestException("Invalid user id");
      }

      if (!bookId || isNaN(bookId)) {
        throw new BadRequestException("Invalid book id");
      }

      await this.userService.borrowBook(userId, bookId);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
      // res.status(500).json({ message: "Server error" });
    }
  }

  public async returnBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = +req.params.userId;
      const bookId = +req.params.bookId;
      const userScore = +req.body.score;

      if (!userId || isNaN(userId)) {
        throw new BadRequestException("Invalid user id");
      }

      if (!bookId || isNaN(bookId)) {
        throw new BadRequestException("Invalid book id");
      }

      await this.userService.returnBook(userId, bookId, userScore);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
      // res.status(500).json({ message: "Server error" });
    }
  }

  public routes() {
    this.router.get("/users", serializerMiddleware(User), this.getUsers.bind(this));
    this.router.get("/users/:userId", serializerMiddleware(UserDTO), this.getUser.bind(this));
    this.router.post("/users", validationMiddleware(CreateUserDTO), this.createUser.bind(this));
    this.router.post("/users/:userId/borrow/:bookId", this.borrowBook.bind(this));
    this.router.post("/users/:userId/return/:bookId", validationMiddleware(ReturnBookDTO), this.returnBook.bind(this));
  }
}
