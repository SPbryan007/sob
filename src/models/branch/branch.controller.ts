import {
  Controller,
  Logger,
  Post,
  UseGuards,
  Get,
  Param,
  ParseUUIDPipe,
  HttpStatus,
  Res,
  Body,
} from '@nestjs/common';
import { BranchService } from './branch.service';
import { ReadSimpleBranchDto } from './dto/read-branch.dto';
import { Roles } from '../role/decorators/role.decorator';
import { RoleType } from '../role/roletype.enum';
import { RoleGuard } from '../role/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateSimpleBranchDto } from './dto/create-branch.dto';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { CurrentUser } from '../auth/CurrentUser.decorator';

@Controller('branch')
export class BranchController {
  private logger = new Logger('BranchController');
  constructor(private _branchService: BranchService) {}
  /**
   * async getBranchById
   */
  @Get('/:uid')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  public async getBranchById(
    @CurrentUser() currentUser: CurrentUserDto,
    @Param('uid', ParseUUIDPipe) uid: string,
  ) {
    return await this._branchService.getById(uid, currentUser);
  }
  /**
   * getAll Branches
   */
  @Get('/')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  public async getSimpleCompanies(
    @Res() res,
    @CurrentUser() currentUser: CurrentUserDto,
  ): Promise<ReadSimpleBranchDto[]> {
    const branches = await this._branchService.getSimpleBranches(currentUser);
    return res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Data Retrieved successfully',
      branches: branches,
    });
  }
  /**
   * Create New branch
   */
  @Post('/:uid')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  public async createNewSimpleBranch(
    @Res() res,
    @Param('uid', ParseUUIDPipe) uid: string,
    @Body() data: CreateSimpleBranchDto,
  ): Promise<ReadSimpleBranchDto> {
    const created = await this._branchService.createNewSimpleBranch(uid, data);
    return res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Branch Office has been craated successfully',
      branch_Office: created,
    });
  }
}
