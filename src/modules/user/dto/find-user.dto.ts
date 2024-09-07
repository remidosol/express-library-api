import { IsNotEmpty, IsNumber } from "class-validator";

export class FindUserDTO {
  @IsNotEmpty({ message: "id is required" })
  @IsNumber({}, { message: "You should provide a number value for id" })
  userId!: number;
}
