import {
  AuthCredentialsUserDto,
  SignUpCredentialsStaffDto,
  AuthLoginCredentialsStaffDto,
  SignUpCredentialsCustomerDto,
  LoginCredentialsUserCustomerDto,
} from './dto/authCredentials.dto';
import { UserStaff } from '../user-staff/user.entity';
import { UserCustomer } from '../user-customer/user-customer.entity';
import {
  Repository,
  EntityRepository,
  getConnection,
  EntityManager,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { ReadSignUpStaffDto, ReadSignUpCustomerDto } from './dto/read-auth.dto';
import {
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { Role } from '../role/role.entity';
import { Staff } from '../staff/staff.entity';
import { CurrentUserDto } from './dto/CurrentUser.dto';
import { ReadUserStaffDto } from '../user-staff/dto/';
import { UserStaffRepository } from '../user-staff/user.repository';
import * as Speakeasy from 'speakeasy';

@EntityRepository(UserStaff)
export class AuthRepository extends Repository<UserStaff> {
  /**
   * signUpUserCustomer
   */
  async signUpUserCustomer(_signUpCredentials: SignUpCredentialsCustomerDto) {
    const user = new UserCustomer();
    user.name = _signUpCredentials.name;
    user.email = _signUpCredentials.email;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(
      _signUpCredentials.password,
      user.salt,
    );
    try {
      const saved = await user.save();
      return plainToClass(ReadSignUpCustomerDto, saved);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`username already exists`);
      } else {
        throw new InternalServerErrorException(
          `Something went wrog trying to save a new customer`,
          error,
        );
      }
    }
  }

  async updatePasswordUserStaff(
    currentUser: CurrentUserDto,
    newPassword: string,
  ): Promise<boolean> {
    const newSalt = await bcrypt.genSalt();
    const newPass = await this.hashPassword(newPassword, newSalt);
    await getConnection()
      .createQueryBuilder()
      .update(UserStaff)
      .set({
        password: newPass,
        salt: newSalt,
      })
      .where('idUser = :id', { id: currentUser.id })
      .execute();
    return true;
  }

  async updatePasswordUserCustomer(
    email: string,
    newPassword: string,
  ): Promise<boolean> {
    const newSalt = await bcrypt.genSalt();
    const newPass = await this.hashPassword(newPassword, newSalt);

    await getConnection()
      .createQueryBuilder()
      .update(UserCustomer)
      .set({
        password: newPass,
        salt: newSalt,
      })
      .where('email = :email', { email })
      .execute();
    return true;
  }

  async signUpUserStaff(
    _signUpCredentials: SignUpCredentialsStaffDto,
  ): Promise<ReadSignUpStaffDto> {
    const user = new UserStaff();
    user.username = _signUpCredentials.username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(
      _signUpCredentials.password,
      user.salt,
    );
    user.role = _signUpCredentials.role as Role;
    user.staff = _signUpCredentials.staff as Staff;
    try {
      const saved = await user.save();
      return plainToClass(ReadSignUpStaffDto, saved);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`username already exists`);
      } else {
        throw new InternalServerErrorException(
          `Something went wrog trying to save a new company`,
          error,
        );
      }
    }
  }
  /**
   * name
   */
  async validateUserCustomerPassword(
    LoginCredentials: LoginCredentialsUserCustomerDto,
  ): Promise<UserCustomer> {
    const user = await getConnection()
      .getRepository(UserCustomer)
      .createQueryBuilder('user') //escapa strings
      .where('user.email = :email', { email: LoginCredentials.email })
      .getOne();
    if (user && (await user.validatePassword(LoginCredentials.password))) {
      return user;
    } else {
      return null;
    }
  }

  async validateUserStaffPassword(
    authCredentials: AuthLoginCredentialsStaffDto,
  ): Promise<ReadUserStaffDto> {
    const { username, password } = authCredentials;
    const user = await getConnection()
      .getRepository(UserStaff)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.staff', 'staff')
      .leftJoinAndSelect('staff.company', 'com')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.username = :username', { username })
      .getOne();
    if (user && (await user.validatePassword(password))) {
      return plainToClass(ReadUserStaffDto, user);
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
