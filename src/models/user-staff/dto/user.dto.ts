import {
  IsString,
  MinLength,
  MaxLength,
  Matches,
  IsIn,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { RoleType } from 'src/models/role/roletype.enum';
export class UserDto {
  // @IsString()
  // @IsNotEmpty()
  // @MinLength(4)
  // @MaxLength(20)
  // username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n]) (?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  roles: RoleType[];
}
