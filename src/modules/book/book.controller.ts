import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "tsyringe";
import { BadRequestException } from "../../exceptions/http-exceptions";
import { BookService } from "./book.service";
import { serializerMiddleware, validationMiddleware } from "../../middlewares";
import { Book } from "./book.entity";
import { CreateBookDTO } from "./dto";

@injectable()
export class BookController {
  public router: Router;

  constructor(@inject(BookService) private bookService: BookService) {
    this.router = Router();
    this.routes();
  }

  public async getBooks(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const books = await this.bookService.getBooks();

      res.status(200).json(books);
    } catch (err) {
      console.error(err);
      next(err);
      // res.status(500).json({ message: "Server error" });
    }
  }

  public getBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bookId = Number(req.params.bookId);

      if (!bookId || isNaN(bookId)) {
        throw new BadRequestException("Invalid book id");
      }

      const user = await this.bookService.getBook(bookId);
      res.send(user);
    } catch (err) {
      console.error(err);
      next(err);
      // res.status(500).json({ message: "Server error" });
    }
  };

  public async createBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { name } = req.body;

    try {
      await this.bookService.createBook(name);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      next(err);
      // res.status(500).json({ message: "Server error" });
    }
  }

  public routes() {
    this.router.get("/books", serializerMiddleware(Book), this.getBooks.bind(this));
    this.router.get("/books/:bookId", serializerMiddleware(Book), this.getBook.bind(this));
    this.router.post("/books", validationMiddleware(CreateBookDTO), this.createBook.bind(this));
  }
}
