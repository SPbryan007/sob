import { Injectable, NotFoundException } from '@nestjs/common';
import { UserStaffRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStaff } from './user.entity';
import { RoleRepository } from '../role/role.repository';
import { status } from '../../shared/entity-status.enum';
import { UserStatus } from './user-status.enum';
import { ReadUserStaffDto, CreateUserDto } from './dto';
import { plainToClass } from 'class-transformer';
import { AuthRepository } from '../auth/auth.repository';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';

@Injectable()
export class UserStaffService {
  constructor(
    @InjectRepository(UserStaffRepository)
    private readonly _userStaffRepository: UserStaffRepository,
  ) // @InjectRepository(RoleRepository)
  // private readonly _roleRepository: RoleRepository,
  // @InjectRepository(AuthRepository)
  // private readonly _authRepository: AuthRepository,
  {}

  async getById(uid: string): Promise<ReadUserStaffDto> {
    const user = this._userStaffRepository.findOne(uid);
    return plainToClass(ReadUserStaffDto, user);
  }

  async getAll(user: CurrentUserDto): Promise<ReadUserStaffDto[]> {
    const users: UserStaff[] = await this._userStaffRepository.find({
      where: { status: status.ACTIVE },
    });
    return users.map((user: UserStaff) => plainToClass(ReadUserStaffDto, user));
  }
  async setStatus(uid: string, status: UserStatus): Promise<void> {
    const userExist = await this._userStaffRepository.findOne(uid);
    if (!userExist) {
      throw new NotFoundException(`User does not exists`);
    }
    await this._userStaffRepository.update(uid, { status: status });
  }
  //async delete(id: string, currentUser: CurrentUserDto): Promise<void> {
  // const userExist = await this._userStaffRepository.findOne(id);
  // if (!userExist) {
  //   throw new NotFoundException();
  // }
  // await this._userStaffRepository.update(id, { status: UserStatus.INACTIVE });
  //}

  // async setRoleToUser(userId: number, roleId: number) {
  //   const userExist = await this._userStaffRepository.findOne(userId, {
  //     where: { status: status.ACTIVE },
  //   });

  //   if (!userExist) {
  //     throw new NotFoundException();
  //   }

  //   const roleExist = await this._roleRepository.findOne(roleId, {
  //     where: { status: status.ACTIVE },
  //   });

  //   if (!roleExist) {
  //     throw new NotFoundException('Role does not exist');
  //   }

  //   userExist.roles.push(roleExist);

  //   return await this._userStaffRepository.save(userExist);
  // }
}
