import {
  Controller,
  Post,
  UsePipes,
  UseGuards,
  ValidationPipe,
  Body,
  Res,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Get,
} from '@nestjs/common';
import { RoleType } from '../role/roletype.enum';
import { Roles } from '../role/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../role/guards/role.guard';
import { CurrentUser } from '../auth/CurrentUser.decorator';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { TripulationService } from './tripulation.service';
import { CreateTripulationDto } from './dto/create.dto';

@Controller('tripulation')
export class TripulationController {
  constructor(private _tripulationService: TripulationService) {}

  /**
   * async getById
   */
  @Get('/uid')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(), RoleGuard)
  public async getById(
    @Param('uid') uid: string,
    @CurrentUser() currentUser: CurrentUserDto,
  ) {
    return await this._tripulationService.getById(currentUser, uid);
  }
  /**
   * async getById
   */
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(), RoleGuard)
  @Get('/')
  public async getAll(@CurrentUser() currentUser: CurrentUserDto) {
    return await this._tripulationService.getAll(currentUser);
  }
  /**
   * async create New Tripulation
   */
  @Post('/create/:uid')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(), RoleGuard)
  public async createNewStaff(
    @Param('uid', ParseUUIDPipe) uid: string,
    @CurrentUser() currentUser: CurrentUserDto,
    @Body() data: CreateTripulationDto,
    @Res() res,
  ): Promise<void> {
    await this._tripulationService.createNewTripulation(uid, data);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Triputalation was created succesfully',
    });
  }
}
