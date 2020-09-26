import {
  Repository,
  EntityRepository,
  getRepository,
  getConnection,
} from 'typeorm';
import { Staff } from './staff.entity';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { RoleType } from '../role/roletype.enum';
// import { position } from './position.enum';
import { ReadStaffDto, ReadStaffSimpleDto } from './dto/read-staff.dto';
import { plainToClass } from 'class-transformer';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { Person } from '../person/person.entity';
import { UserStaff } from '../user-staff/user.entity';
import * as bcrypt from 'bcrypt';
import { PersonRepository } from '../person/person.repository';
import { ReadPersonDto } from '../person/dto/read-person.dto';
import { ReadSignUpStaffDto } from '../auth/dto/read-auth.dto';
import { Branch } from '../branch/branch.entity';
import { Company } from '../company/com.entity';

@EntityRepository(Staff)
export class StaffRepository extends Repository<Staff> {
  /**
   * getById return a staff
   */
  public async getById(
    currentUser: CurrentUserDto,
    idstaff: string,
  ): Promise<ReadStaffDto> {
    const { role, company } = currentUser;
    const staff = await this.createQueryBuilder('staff')
      .addSelect('per.*')
      .leftJoinAndSelect('staff.person', 'per')
      .where('staff.companyIdCom = :idCompany', {
        idCompany: currentUser.company.idCom,
      })
      .andWhere('staff.idStaff = :idStaff', { idStaff: idstaff })
      .getOne();
    // if (role.includes(RoleType.ADMIN)) {
    //   query.andWhere('staff.position = :position', {
    //     position: RoleType.STAFF_SALES,
    //   });
    // }
    if (!staff) {
      throw new NotFoundException(`staff with ID ${idstaff} does not exists`);
    }
    return plainToClass(ReadStaffDto, staff);
  }
  /**
   * getallStaff retrive data from staff
   */
  public async getAllStaff(
    currentUser: CurrentUserDto,
  ): Promise<ReadStaffDto[]> {
    const staff = await this.createQueryBuilder('staff')
      .addSelect('per.*')
      .leftJoinAndSelect('staff.person', 'per')
      .where('staff.companyIdCom = :idCompany', {
        idCompany: currentUser.company.idCom,
      })
      .getMany();
    // const query = this.createQueryBuilder('staff');
    // query.where('staff.companyIdCom = :idCompany', {
    //   idCompany: currentUser.company.idCom,
    // });
    // if (role.includes(RoleType.ADMIN)) {
    //   query.andWhere('staff.position = :position', {
    //     position: RoleType.STAFF_SALES,
    //   });
    // }
    // query.cache(true);
    try {
      return plainToClass(ReadStaffDto, staff);
    } catch (error) {
      throw new InternalServerErrorException(
        `Something went wrong trying to retrive data On getAllStaff`,
      );
    }
  }
  /**
   * createNewStaff Method
   */
  public async createNewStaff(
    company: Company,
    person: Person,
  ): Promise<Staff> {
    const newstaff = new Staff();
    newstaff.company = company;
    newstaff.person = person;
    try {
      return await newstaff.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `Something went wront tryin to create a new staff`,
      );
    }
  }
}

/**
 * name
 */
// let staff_saved: CreateOnlyStaffDto;
// const perso = person
//   .save()
//   .then(async res => {
//     const staff = new Staff();
//     staff.entry_date = data.entry_date;
//     staff.position = data.position;
//     staff.address = data.address;
//     staff.company = company;
//     staff.person = res;
//     try {
//       staff_saved = await staff.save();
//     } catch (error) {
//       this.logger.error(
//         `Failed creating a new staff, Data: ${JSON.stringify(
//           CreateStaffDto,
//         )}`,
//         error.stack,
//       );
//       throw new InternalServerErrorException();
//     }
//   })
//   .catch(err => {
//     throw new ConflictException('Document already exists');
//   });
