import { IsEmail, IsString, ValidateNested, IsDate } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadStaffDto } from 'src/models/staff/dto/read-staff.dto';
import { ReadRoleDto } from 'src/models/role/dto';

@Exclude()
export class ReadUserStaffDto {
  @Expose()
  @IsString()
  readonly idUser: string;

  @Expose()
  @IsEmail()
  readonly username: string;

  @Expose()
  @ValidateNested({ each: true })
  @Type(type => ReadRoleDto)
  readonly role: ReadRoleDto;

  @Expose()
  @ValidateNested({ each: true })
  @Type(type => ReadStaffDto)
  readonly staff: ReadStaffDto;

  // @IsDate()
  // readonly createdAt: Date;

  // @IsDate()
  // readonly updatedAt: Date;
}
