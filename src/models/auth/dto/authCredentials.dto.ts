import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsIn,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { RoleType } from 'src/models/role/roletype.enum';
import { CreateRoleDto } from 'src/models/role/dto';
import { Type } from 'class-transformer';
import { CreateStaffDto } from 'src/models/staff/dto/create-staff.dto';

export class AuthLoginCredentialsStaffDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class AuthCredentialsStaffDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsIn([RoleType.MANAGEMENT, RoleType.ADMIN, RoleType.STAFF_SALES])
  @IsString()
  role: RoleType;
}

export class AuthCredentialsUserDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
export class SignUpCredentialsStaffDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @ValidateNested({ each: true })
  @Type(() => CreateRoleDto)
  @IsNotEmpty()
  role: CreateRoleDto;

  @ValidateNested({ each: true })
  @Type(() => CreateStaffDto)
  @IsNotEmpty()
  staff: CreateStaffDto;
}

export class SignUpCredentialsCustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  secret: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
export class LoginCredentialsUserCustomerDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
export class VerificationCodeDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  secret: string;
}
export class ResetDataPasswordDto {
  @IsString()
  @IsNotEmpty()
  new_password: string;

  @IsString()
  @IsNotEmpty()
  email: string;
}

// import { getEntityManagerOrTransactionManager } from 'typeorm-transactional-cls-hooked';

// class MyRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
//   private _connectionName: string = 'default'
//   private _manager: EntityManager | undefined

//   set manager(manager: EntityManager) {
//     this._manager = manager
//     this._connectionName = manager.connection.name
//   }

//   // Always get the entityManager from the cls namespace if active, otherwise, use the original or getManager(connectionName)
//   get manager(): EntityManager {
//     return getEntityManagerOrTransactionManager(this._connectionName, this._manager)
//   }
// }
