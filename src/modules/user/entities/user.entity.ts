import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BorrowRecord } from "./book-borrow.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100, unique: true })
  name!: string;

  @OneToMany(() => BorrowRecord, (borrowRecord) => borrowRecord.user)
  borrowRecords!: BorrowRecord[];
}
