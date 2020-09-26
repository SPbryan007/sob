import {
  IsEmail,
  IsIn,
  IsNumber,
  IsString,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { RoleType } from 'src/models/role/roletype.enum';
import { Company } from 'src/models/company/com.entity';

export class CurrentUserDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  company?: Company;

  @IsNotEmpty()
  @IsIn([
    RoleType.ADMIN,
    RoleType.CUSTOMER,
    RoleType.MANAGEMENT,
    RoleType.SPADMIN,
    RoleType.STAFF_SALES,
  ])
  role?: RoleType;
}
