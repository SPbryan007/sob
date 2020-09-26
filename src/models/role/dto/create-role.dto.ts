import { IsString, MaxLength, IsIn } from 'class-validator';
import { RoleType } from '../roletype.enum';

export class CreateRoleDto {
  @IsString()
  @IsIn([
    RoleType.ADMIN,
    RoleType.CUSTOMER,
    RoleType.STAFF_SALES,
    RoleType.MANAGEMENT,
  ])
  @MaxLength(20, { message: 'name too long' })
  readonly name: string;

  @IsString()
  @MaxLength(100, { message: 'description too long' })
  readonly description: string;
}
