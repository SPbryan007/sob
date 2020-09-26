import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { CompanyRepository } from './com.repository';
import { Company } from './com.entity';
import { CreateSimpleComDto, CreateNewComDto } from './dto/create-com.dto';
import { ReadSimpleComDto } from './dto/read-com.dto';
import { plainToClass } from 'class-transformer';
import { getConnection } from 'typeorm';
import { Person } from '../person/person.entity';
import { PersonRepository } from '../person/person.repository';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { StaffRepository } from '../staff/staff.repository';
import { UserStaffRepository } from '../user-staff/user.repository';
import { AuthRepository } from '../auth/auth.repository';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyRepository)
    private _comRepository: CompanyRepository,
  ) {}

  /**
   * async getById
   */
  public async getSimpleComById(idCom: string): Promise<ReadSimpleComDto> {
    const found = await this._comRepository.findOne(idCom);
    if (!found)
      throw new NotFoundException(`Company with ID ${idCom} not found`);
    return found;
  }
  /**
   * getAllCompanies
   */
  public async getSimpleCompanies(): Promise<ReadSimpleComDto[]> {
    const companies = await this._comRepository.find();
    return plainToClass(ReadSimpleComDto, companies);
  }

  /**
   * create a new simple company
   */
  public async createNewSimpleCom(
    createSimpleComDto: CreateSimpleComDto,
  ): Promise<ReadSimpleComDto> {
    return await this._comRepository.createNewSimpleCom(createSimpleComDto);
  }
  /**
   * create new company
   */
  public async createNewCom(createNewCom: CreateNewComDto): Promise<void> {
    const company = await this.createNewSimpleCom(createNewCom.company);
    const person = await getConnection()
      .getCustomRepository(PersonRepository)
      .createNewPerson(createNewCom.person);
    const role = await getConnection()
      .getRepository(Role)
      .findOne({ where: { name: createNewCom.credentials.role } });
    const staff = await getConnection()
      .getCustomRepository(StaffRepository)
      .createNewStaff(company as Company, person);
    const user = getConnection()
      .getCustomRepository(AuthRepository)
      .signUpUserStaff({
        username: createNewCom.credentials.username,
        password: createNewCom.credentials.password,
        role: role,
        staff: staff,
      });
  }
  /**
   * delete
   */
  public async delete(idCom: string): Promise<void> {
    const result = await this._comRepository.delete(idCom);
    if (result.affected === 0)
      throw new NotFoundException(`Company with ID "${idCom}" not found`);
  }

  async update(
    idCom: string,
    data: Partial<CreateSimpleComDto>,
  ): Promise<boolean> {
    await this.getSimpleComById(idCom);
    await this._comRepository.update({ idCom }, data);
    return true;
  }
}
