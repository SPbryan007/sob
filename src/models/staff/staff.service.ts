import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffRepository } from './staff.repository';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { ReadStaffDto } from './dto/read-staff.dto';
import { CreateStaffAndSigupDto } from './dto/create-staff.dto';
import { PersonRepository } from '../person/person.repository';
import { getConnection } from 'typeorm';
import { AuthRepository } from '../auth/auth.repository';
import { Role } from '../role/role.entity';
import { Branch } from '../branch/branch.entity';
import { CreateStaffDriverDto } from '../driver/dto/create-driver.dto';
import { DriverRepository } from '../driver/driver.repository';
import { Driver } from '../driver/driver.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(StaffRepository)
    private _staffRepository: StaffRepository,
    @InjectRepository(AuthRepository)
    private _authRepository: AuthRepository,
  ) {}

  /**
   * get only staff
   */
  public async getById(
    user: CurrentUserDto,
    idstaff: string,
  ): Promise<ReadStaffDto> {
    return await this._staffRepository.getById(user, idstaff);
  }
  /**
   * async getAllStaff
   */
  public async getAllStaff(
    currentUser: CurrentUserDto,
  ): Promise<ReadStaffDto[]> {
    return await this._staffRepository.getAllStaff(currentUser);
  }
  /**
   * createNewStaffDriver
   */
  public async createNewStaffDriver(
    currentUser: CurrentUserDto,
    data: CreateStaffDriverDto,
  ): Promise<boolean> {
    const person = await getConnection()
      .getCustomRepository(PersonRepository)
      .createNewPerson(data.person);
    const staff = await this._staffRepository.createNewStaff(
      currentUser.company,
      person,
    );
    const driver = await getConnection()
      .getCustomRepository(DriverRepository)
      .createNewDriver(staff, data.driver);
    return true;
  }
  /**
   * async create
   */
  public async createNewStaff(
    currentUser: CurrentUserDto,
    data: CreateStaffAndSigupDto,
  ): Promise<boolean> {
    //let branch: Branch = null;
    // if () {
    //   branch = await getConnection()
    //     .getRepository(Branch)
    //     .findOne({
    //       where: { idBran: data.branch, company: currentUser.company },
    //     });
    // }
    const person = await getConnection()
      .getCustomRepository(PersonRepository)
      .createNewPerson(data.person);
    const role = await getConnection()
      .getRepository(Role)
      .findOne({ where: { name: data.credentials.role } });
    if (!role)
      throw new NotFoundException(`Rol ${data.credentials.role} not found`);
    const staff = await this._staffRepository.createNewStaff(
      currentUser.company,
      person,
    );
    await this._authRepository.signUpUserStaff({
      username: data.credentials.username,
      password: data.credentials.password,
      role: role,
      staff: staff,
    });
    return true;
  }
  /**
   * async update
   */
  public async update() {}

  public async getDrivers(currentUser: CurrentUserDto): Promise<any[]> {
    const driver = await getConnection()
      .getRepository(Driver)
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.staff', 'staff')
      .leftJoinAndSelect('staff.person', 'person')
      .getMany();
    return driver;
  }
}
