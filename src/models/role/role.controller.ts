import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { Role } from './role.entity';
import { ReadRoleDto, CreateRoleDto, UpdateRoleDto } from './dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get(':id')
  getRoleById(@Param('id', ParseIntPipe) id: number): Promise<ReadRoleDto> {
    return this._roleService.getById(id);
  }

  @Get()
  getRoles(): Promise<ReadRoleDto[]> {
    return this._roleService.getAll();
  }

  @Post('/create')
  createRole(@Body() role: CreateRoleDto): Promise<CreateRoleDto> {
    console.log(role);
    return this._roleService.createRole(role);
  }

  @Patch(':id')
  updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: Partial<UpdateRoleDto>,
  ): Promise<UpdateRoleDto> {
    return this._roleService.update(id, role);
  }

  @Delete(':id')
  deleteRole(@Param('id', ParseIntPipe) id: number) {
    return this._roleService.delete(id);
  }
}
