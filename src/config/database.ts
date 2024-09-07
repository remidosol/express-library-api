import { DataSource } from "typeorm";
import { User } from "../modules/user/entities/user.entity";
import { Book } from "../modules/book/book.entity";
import { BorrowRecord } from "../modules/user/entities";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Book, BorrowRecord],
  synchronize: true,
});
