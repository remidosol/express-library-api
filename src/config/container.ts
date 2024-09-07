import { container } from "tsyringe";
import { UserService } from "../modules/user/user.service";
import { BookService } from "../modules/book/book.service";
import { UserController } from "../modules/user/user.controller";
import { BookController } from "../modules/book/book.controller";
import { Book } from "../modules/book/book.entity";
import { User, BorrowRecord } from "../modules/user/entities";
import { AppDataSource } from "./database";

// Register repositories
container.register("UserRepository", {
  useFactory: () => AppDataSource.getRepository(User),
});
container.register("BookRepository", {
  useFactory: () => AppDataSource.getRepository(Book),
});
container.register("BorrowRecordRepository", {
  useFactory: () => AppDataSource.getRepository(BorrowRecord),
});

// Register services
container.registerSingleton<UserService>(UserService);
container.registerSingleton<BookService>(BookService);

// Register controllers
container.registerSingleton<UserController>(UserController);
container.registerSingleton<BookController>(BookController);
