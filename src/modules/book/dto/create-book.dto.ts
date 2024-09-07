import { IsNotEmpty, Length } from "class-validator";

export class CreateBookDTO {
  @IsNotEmpty({ message: "Name is required" })
  @Length(2, 50, { message: "Name must be between 2 and 50 characters" })
  name!: string;
}
