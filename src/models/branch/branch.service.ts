import { Injectable, NotFoundException } from '@nestjs/common';
import { BranchRepository } from './branch.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Branch } from './branch.entity';
import { ReadSimpleBranchDto } from './dto/read-branch.dto';
import { plainToClass } from 'class-transformer';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { CreateSimpleBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private _branchRepository: BranchRepository,
  ) {}
  /**
   * getAll method retuns all branches
   */
  public async getSimpleBranches(
    currentUser: CurrentUserDto,
  ): Promise<ReadSimpleBranchDto[]> {
    return this._branchRepository.getSimpleBranches(currentUser.company.idCom);
  }
  /**
   * getByID method retuns a branch office
   */
  public async getById(
    uidBranch: string,
    currentUser: CurrentUserDto,
  ): Promise<ReadSimpleBranchDto> {
    return this._branchRepository.getById(currentUser.company, uidBranch);
  }
  /**
   * create method | only users  who can  create new branches
   */
  public async createNewSimpleBranch(
    uid: string,
    data: CreateSimpleBranchDto,
  ): Promise<ReadSimpleBranchDto> {
    return this._branchRepository.createNewSimpleBranch(uid, data);
  }

  public async create_su(branch: CreateSimpleBranchDto, idCompany: number) {}
}
