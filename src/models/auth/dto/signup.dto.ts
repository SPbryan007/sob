import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsIn,
} from 'class-validator';
import { UserStatus } from 'src/models/user-staff/user-status.enum';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n]) (?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password too weak',
  // })
  password: string;

  // @IsIn([UserStatus.ACTIVE, UserStatus.INACTIVE])
  // status: UserStatus;
}
export class SignUpRO {
  idUser?: string;
  email?: string;
  status?: UserStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
