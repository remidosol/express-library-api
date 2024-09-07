import { IsNotEmpty, Length } from "class-validator";

export class CreateUserDTO {
  @IsNotEmpty({ message: "Name is required" })
  @Length(2, 20, { message: "Name must be between 2 and 20 characters" })
  name!: string;
}
