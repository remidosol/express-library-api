import { IsNotEmpty, IsNumber, Max, Min } from "class-validator";

export class ReturnBookDTO {
  // @ValidateIf((o: ReturnBookDTO) => o.score !== undefined && o.score !== null)
  @IsNotEmpty({ message: "Score is required" })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: "You should provide a number value for id" })
  @Min(1, { message: "Score should be greater than or equal to 1" })
  @Max(10, { message: "Score should be less than or equal to 10" })
  score!: number;
}
