import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 150 })
  name!: string;

  @Column({
    type: "float",
    default: 0,
    transformer: { to: (value) => value, from: (value) => +parseFloat(value).toFixed(1) },
  })
  score!: number;
}
