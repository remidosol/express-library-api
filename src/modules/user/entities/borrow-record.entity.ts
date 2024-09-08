import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { User } from "./user.entity";
import { Book } from "../../book/book.entity";

@Entity("borrow_records")
export class BorrowRecord {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.borrowRecords)
  user!: User;

  @ManyToOne(() => Book, (book) => book)
  book!: Book;

  @Column({ type: "boolean", default: false })
  isReturned!: boolean;

  @Column({ type: "int", default: -1 })
  userScore!: number;
}
