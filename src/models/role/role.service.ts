import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { RoleRepository } from './role.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { ReadRoleDto, CreateRoleDto, UpdateRoleDto } from './dto';
import { plainToClass } from 'class-transformer';
import { status } from '../../shared/entity-status.enum';
import { stat } from 'fs';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleRepository)
    private readonly _roleRepository: RoleRepository,
  ) {}

  async getById(id: number): Promise<ReadRoleDto> {
    if (!id) {
      throw new BadRequestException('id must be sent');
    }

    const role: Role = await this._roleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!role) {
      throw new NotFoundException();
    }

    return plainToClass(ReadRoleDto, role);
  }

  async getAll(): Promise<ReadRoleDto[]> {
    const roles: Role[] = await this._roleRepository.find({
      where: { status: status.ACTIVE },
    });

    return roles.map((role: Role) => plainToClass(ReadRoleDto, role));
  }

  async createRole(role: CreateRoleDto): Promise<ReadRoleDto> {
    const savedRole = await this._roleRepository.save(role);
    console.log(savedRole);

    return plainToClass(ReadRoleDto, savedRole);
  }

  async update(id: number, role: Partial<UpdateRoleDto>): Promise<ReadRoleDto> {
    const foundRole: Role = await this._roleRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });
    if (!foundRole) {
      throw new NotFoundException('this role does not exist');
    }
    foundRole.name = role.name;
    foundRole.description = role.description;

    const updateRole: Role = await this._roleRepository.save(foundRole);

    return plainToClass(ReadRoleDto, updateRole);
  }

  async delete(id: number): Promise<void> {
    const roleExists = await this._roleRepository.findOne(id, {
      where: { status: 'ACTIVE' },
    });

    if (!roleExists) {
      throw new NotFoundException();
    }

    await this._roleRepository.update(id, { status: 'INACTIVE' });
  }
}
