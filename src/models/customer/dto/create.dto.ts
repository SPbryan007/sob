import {
  IsEmail,
  IsString,
  IsOptional,
  IsPhoneNumber,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Person } from 'src/models/person/person.entity';
import { CreatePersonDto } from 'src/models/person/dto/create-person.dto';

export class CreateCustomerDto {
  @IsEmail()
  @IsString()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => Person)
  person: CreatePersonDto;
}
