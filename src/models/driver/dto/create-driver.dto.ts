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
import { Driver } from '../driver.entity';
import { category } from '../category.enum';

export class CreateDriverDto {
  @IsString()
  @IsNotEmpty()
  nro_licence: string;

  @IsNotEmpty()
  @IsIn([category.B, category.C, category.A])
  category: category;
}

export class CreateStaffDriverDto {
  @ValidateNested({ each: true })
  @Type(() => CreatePersonDto)
  @IsNotEmpty()
  person: Person;

  @ValidateNested({ each: true })
  @Type(() => CreateDriverDto)
  @IsNotEmpty()
  driver: Driver;
}

export class ReporteGananciasDto {
  @IsNotEmpty()
  @IsString()
  from: category;

  @IsNotEmpty()
  @IsString()
  to: category;
}
