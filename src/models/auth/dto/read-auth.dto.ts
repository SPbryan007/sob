import { UserStatus } from 'src/models/user-staff/user-status.enum';
import { ReadRoleDto } from 'src/models/role/dto';
import { Expose, Exclude, Type } from 'class-transformer';
import { IsEmail, IsIn, IsInt, IsString } from 'class-validator';
import { StatusEmail } from 'src/models/user-customer/enum/status-email.enum';

@Exclude()
export class ReadSignUpStaffDto {
  @Expose()
  @IsString()
  readonly idUser: string;

  @Expose()
  @IsString()
  readonly username: string;

  @IsString()
  @IsIn([UserStatus.ACTIVE, UserStatus.INACTIVE])
  @Expose()
  readonly status: UserStatus;

  @Expose()
  @Type(type => ReadRoleDto)
  readonly role: ReadRoleDto;
}

@Exclude()
export class ReadSignUpCustomerDto {
  @Expose()
  @IsString()
  readonly idUser: string;

  @Expose()
  @IsString()
  readonly name: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsIn([StatusEmail.TO_BE_CHECKED, StatusEmail.VERIFIED])
  status_email: StatusEmail;

  @Expose()
  @IsString()
  secret: string;
}
