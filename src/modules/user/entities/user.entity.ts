import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { BorrowRecord } from "./borrow-record.entity";
import { Exclude } from "class-transformer";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100, unique: true })
  name!: string;

  @OneToMany(() => BorrowRecord, (borrowRecord) => borrowRecord.user)
  @Exclude({ toClassOnly: true })
  borrowRecords!: BorrowRecord[];

  books?: {
    past: {
      name: string;
      userScore?: number;
    }[];
    present: {
      name: string;
    }[];
  };
}
