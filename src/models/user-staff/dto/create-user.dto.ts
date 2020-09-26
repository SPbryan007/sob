import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsIn,
  IsOptional,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { RoleType } from 'src/models/role/roletype.enum';
import { Role } from 'src/models/role/role.entity';

export class CreateUserDto {
  @IsIn([RoleType.CUSTOMER, RoleType.ADMIN, RoleType.STAFF_SALES])
  @IsString()
  role: RoleType;
}
// @IsString()
// @IsNotEmpty()
// @MinLength(8)
// @MaxLength(50)
// // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n]) (?=.*[A-Z])(?=.*[a-z]).*$/, {
// //   message: 'password too weak',
// // })
// password: string;

// @IsString()
// @IsNotEmpty()
// @MinLength(10)
// @MaxLength(50)
// email: string;
