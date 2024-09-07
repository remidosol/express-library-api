import { Expose, Type } from "class-transformer";

export class UserDTO {
  id!: number;
  name!: string;
  @Type(() => BorrowRecordDTO)
  books!: {
    past: BorrowRecordDTO[];
    present: BorrowRecordDTO[];
  };
}

export class BorrowRecordDTO {
  name!: string;

  @Expose({ groups: ["past"] })
  userScore?: number;
}
