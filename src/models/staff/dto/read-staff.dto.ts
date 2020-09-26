import {
  IsString,
  IsIn,
  IsNotEmpty,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Person } from 'src/models/person/person.entity';
import { Company } from 'src/models/company/com.entity';
import { Type } from 'class-transformer';
import { ReadPersonDto } from 'src/models/person/dto/read-person.dto';
import { ReadSignUpStaffDto } from 'src/models/auth/dto/read-auth.dto';

export class ReadStaffDto {
  @IsString()
  idStaff: string;

  @IsNotEmpty()
  person: Person;

  @IsNotEmpty()
  company: Company;
}
export class ReadStaffSimpleDto {
  @IsString()
  idStaff: string;

  @IsNotEmpty()
  person: Person;
}

export class ReadAfterSignUpStaffDto {
  @ValidateNested({ each: true })
  @Type(() => ReadPersonDto)
  person: ReadPersonDto;

  @ValidateNested({ each: true })
  @Type(() => ReadStaffDto)
  staff: ReadStaffDto;

  @ValidateNested({ each: true })
  @Type(() => ReadSignUpStaffDto)
  user: ReadSignUpStaffDto;
}
