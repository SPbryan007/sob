import {
  Controller,
  Param,
  Get,
  Body,
  Post,
  Res,
  HttpStatus,
  ParseUUIDPipe,
  UsePipes,
  UseGuards,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { ReadStaffDto } from './dto/read-staff.dto';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { CurrentUser } from '../auth/CurrentUser.decorator';
import { CreateStaffAndSigupDto } from './dto/create-staff.dto';
import { Roles } from '../role/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';
import { CreateStaffDriverDto } from '../driver/dto/create-driver.dto';
import { JwtAuthGuard } from '../auth/jw-auth.guard';

@Controller('staff')
export class StaffController {
  constructor(private readonly _staffService: StaffService) {}

  @Get('/drivers')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(), RoleGuard)
  public async getDrivers(
    @CurrentUser() user: CurrentUserDto,
    @Res() res,
  ): Promise<void> {
    const drivers = await this._staffService.getDrivers(user);
    res.status(HttpStatus.OK).json({
      drivers,
    });
  }
  /**
   * async getById returns a only staff
   */
  @Get('/:uid')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(), RoleGuard)
  public async getById(
    @Param('uid', ParseUUIDPipe) uid: string,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<ReadStaffDto> {
    return await this._staffService.getById(user, uid);
  }
  /**
   * getAll  returns all staff
   */
  @Get('/')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UseGuards(AuthGuard(), RoleGuard)
  public async getAll(
    @CurrentUser() currentUser: CurrentUserDto,
  ): Promise<ReadStaffDto[]> {
    return await this._staffService.getAllStaff(currentUser);
  }
  /**
   * async create New Staff
   */
  @Post('/register')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(), RoleGuard)
  public async createNewStaff(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() data: CreateStaffAndSigupDto,
    @Res() res,
  ): Promise<void> {
    await this._staffService.createNewStaff(currentUser, data);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'staff was created succesfully',
    });
  }

  /**
   * async create New Staff
   */
  @Post('/driver/register')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async createNewStaffDriver(
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() data: CreateStaffDriverDto,
    @Res() res,
  ): Promise<void> {
    await this._staffService.createNewStaffDriver(currentUser, data);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'staff driver was created succesfully',
    });
  }
}
