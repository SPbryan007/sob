import {
  IsString,
  IsIn,
  IsOptional,
  IsNotEmpty,
  IsDate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePersonDto } from 'src/models/person/dto/create-person.dto';
import { Person } from 'src/models/person/person.entity';
import { UserStaff } from 'src/models/user-staff/user.entity';
import { Company } from 'src/models/company/com.entity';
import { AuthCredentialsStaffDto } from 'src/models/auth/dto/authCredentials.dto';
import { RoleType } from 'src/models/role/roletype.enum';

export class CreateStaffDto {
  @IsNotEmpty()
  person: Person;

  @IsNotEmpty()
  company: Company;
}

export class CreateStaffAndSigupDto {
  @ValidateNested({ each: true })
  @Type(() => CreatePersonDto)
  person: CreatePersonDto;

  @ValidateNested({ each: true })
  @Type(() => AuthCredentialsStaffDto)
  credentials: AuthCredentialsStaffDto;
}
