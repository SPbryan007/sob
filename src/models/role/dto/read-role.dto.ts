import { IsString, MaxLength, IsNumber, IsIn } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { RoleType } from '../roletype.enum';

@Exclude()
export class ReadRoleDto {
  //@Expose({ name:'identificador'}) a nivel de backend
  @Expose()
  @IsNumber()
  readonly idRole: number;

  @Expose()
  @IsString()
  @IsIn([
    RoleType.ADMIN,
    RoleType.CUSTOMER,
    RoleType.STAFF_SALES,
    RoleType.MANAGEMENT,
  ])
  @MaxLength(20, { message: 'name too long' })
  readonly name: string;

  @Expose()
  @IsString()
  @MaxLength(100, { message: 'description too long' })
  readonly description: string;
}
