import { Repository, EntityRepository, getRepository } from 'typeorm';
import { Branch } from './branch.entity';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { RoleType } from '../role/roletype.enum';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ReadSimpleBranchDto } from './dto/read-branch.dto';
import { CreateSimpleBranchDto } from './dto/create-branch.dto';
import { Company } from '../company/com.entity';

@EntityRepository(Branch)
export class BranchRepository extends Repository<Branch> {
  private branch: Branch;

  async getSimpleBranches(uid: string): Promise<ReadSimpleBranchDto[]> {
    //await this.createQueryBuilder("branch").where("branch.companyId = :uid",{uid}).cache(true).getMany();
    return plainToClass(
      ReadSimpleBranchDto,
      await this.find({ where: { company: uid } }),
    );
  }

  async getById(
    company: Company,
    uidBranch: string,
  ): Promise<ReadSimpleBranchDto> {
    const branch = await this.createQueryBuilder('bran')
      .where('bran.company = :com', { com: company.idCom })
      .andWhere('bran.idBran = :uid', { uid: uidBranch })
      .getOne();
    if (!branch)
      throw new NotFoundException(
        `Branch Office with Id:${uidBranch} not found`,
      );
    return plainToClass(ReadSimpleBranchDto, branch);
  }

  async createNewSimpleBranch(
    uidCompany: string,
    branch: CreateSimpleBranchDto,
  ): Promise<ReadSimpleBranchDto> {
    const company = await getRepository(Company).findOne({
      where: { idCom: uidCompany },
    });
    if (!company)
      throw new NotFoundException(`Company with Id: ${company} not found`);
    const created_branch = new Branch();
    created_branch.name = branch.name;
    created_branch.address = branch.address;
    created_branch.city = branch.city;
    created_branch.telephone = branch.phone;
    created_branch.company = company;
    try {
      const saved = created_branch.save();
      return plainToClass(ReadSimpleBranchDto, created_branch);
    } catch (error) {
      throw new InternalServerErrorException(
        `Somethig was wrong trying to save..`,
      );
    }
  }

  /**
   * Methods that can only be used by superadmin...
   */
  // public createNewBranch_su(
  //   idCom: number,
  //   data: CreateBranchDto,
  // ): Promise<ReadBranchDto> {
  //   //return plainToClass(ReadBranchDto,await this.create());
  //   return;
}
