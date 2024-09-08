import { DataSource } from "typeorm";
import { User } from "../modules/user/entities/user.entity";
import { Book } from "../modules/book/book.entity";
import { BorrowRecord } from "../modules/user/entities";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [User, Book, BorrowRecord],
  synchronize: true,
});
