import {
  Repository,
  EntityRepository,
  getManager,
  getRepository,
} from 'typeorm';
import { UserStaff } from './user.entity';
import { CreateUserDto } from './dto';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.repository';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { RoleType } from '../role/roletype.enum';
import { Person } from '../person/person.entity';
import { Staff } from '../staff/staff.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ReadUserStaffDto } from './dto/read-user.dto';

@EntityRepository(UserStaff)
export class UserStaffRepository extends Repository<UserStaff> {
  async getUsers(currentUser: CurrentUserDto): Promise<ReadUserStaffDto> {
    const { id, role, company } = currentUser;

    const query = await this.createQueryBuilder('user');
    query.addSelect('user.status', 'estado');
    query.addSelect('per.name', 'nombre');
    query.addSelect('per.lastname', 'apellido');
    query.addSelect('rol.name', 'tipo_usuario');
    query.innerJoin(Person, 'per', 'user.personId = per.idPerson');
    query.innerJoin(Staff, 'st', 'per.idPerson = st.personId');
    query.innerJoin(Role, 'rol', 'user.roleId=rol.idRole');
    query.where('st.companyId = :idCom and rol.name');
    if (role.includes(RoleType.ADMIN)) {
      query.andWhere('rol.name = :staffsales');
      query.setParameters({
        idCom: company.idCom,
        staffsales: RoleType.STAFF_SALES,
      });
      query.printSql();
    }
    if (role.includes(RoleType.MANAGEMENT)) {
      query.andWhere('rol.name IN (:...roles)');
      query.setParameters({
        idCom: company.idCom,
        staffsales: RoleType.STAFF_SALES,
        roles: [RoleType.ADMIN, RoleType.STAFF_SALES],
      });
      query.printSql();
    }
    try {
      query.cache(true);
      const users = query.getMany();
      console.log('usuarios..', users);
      return plainToClass(ReadUserStaffDto, users);
    } catch (error) {
      throw new InternalServerErrorException(
        `Something was wrong trying to retrive users data`,
      );
    }
  }
  /**
   * async createNewUserStaff
   */
  //public async createNewUserStaff() {}
}

// import { Repository, EntityRepository } from 'typeorm';
// import { User } from './user.entity';
// import { CreateUserDto } from './dto/create-user.dto';
// import * as bcrypt from 'bcrypt';
// import { ConflictException, InternalServerErrorException } from '@nestjs/common';

// @EntityRepository(User)
// export class UserRepository extends Repository<User> {
//   async signUp(createUserDto: CreateUserDto): Promise<void> {
//     const { username, password, email } = createUserDto;
//     //const exists = this.findOne({ username });
//     // if(exists){
//     //throw some error but is not a good practice due to there are 2 queries
//     // }
//     const user = new User();
//     user.username = username;
//     user.email = email;
//     user.salt = await bcrypt.genSalt();
//     user.password = await this.hashPassword(password, user.salt);

//     try {
//       await user.save();
//     } catch (error) {
//       if (error.code === '23505') {
//         throw new ConflictException('Username or email already exists');
//       } else {
//         throw new InternalServerErrorException();
//       }
//     }
//   }

//   async validateUserPassword(
//     authCredentialsDto: AuthCredentialsDto,
//   ): Promise<string> {
//     const { username, password } = authCredentialsDto;
//     const user = await this.findOne({ username });

//     if (user && (await user.validatePassword(password))) {
//       return user.username;
//     } else {
//       return null;
//     }
//   }

//   private async hashPassword(password: string, salt: string): Promise<string> {
//     return await bcrypt.hash(password, salt);
//   }
// }
