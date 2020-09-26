import {
  IsNotEmpty,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreatePersonDto } from 'src/models/person/dto/create-person.dto';
import { Type } from 'class-transformer';
import { AuthCredentialsStaffDto } from 'src/models/auth/dto/authCredentials.dto';

export class CreateSimpleComDto {
  @MaxLength(50, { message: 'name too long' })
  @MinLength(5, { message: 'name too weak' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'name too weak' })
  @MaxLength(25, { message: 'name too long' })
  nit: string;

  @IsNotEmpty()
  @MinLength(5, { message: 'name too weak' })
  @MaxLength(50, { message: 'name too long' })
  address: string;

  @IsNotEmpty()
  @MinLength(5, { message: 'name too weak' })
  @MaxLength(30, { message: 'name too long' })
  city: string;

  @IsNotEmpty()
  @MinLength(5, { message: 'name too weak' })
  @MaxLength(30, { message: 'name too long' })
  country: string;
}

export class CreateNewComDto {
  @ValidateNested({ each: true })
  @Type(() => CreateSimpleComDto)
  company: CreateSimpleComDto;

  @ValidateNested({ each: true })
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;

  @ValidateNested({ each: true })
  @Type(() => AuthCredentialsStaffDto)
  credentials: AuthCredentialsStaffDto;
}
