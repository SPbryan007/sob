import {
  Controller,
  Post,
  Res,
  Body,
  HttpStatus,
  Get,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CurrentUser } from '../auth/CurrentUser.decorator';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { Roles } from '../role/decorators/role.decorator';
import { RoleType } from '../role/roletype.enum';
import { JwtAuthGuard } from '../auth/jw-auth.guard';
import { RoleGuard } from '../role/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { DriverService } from './driver.service';
import { ReporteGananciasDto } from './dto/create-driver.dto';

@Controller('driver')
export class DriverController {
  constructor(private _driverService: DriverService) {}

  @Get('/ganancia/:uid')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async getBuses(
    @CurrentUser() user: CurrentUserDto,
    @Param('uid') driver: string,
    @Res() res,
  ): Promise<any> {
    console.log('entrooooooooo', user);
    const ganancias = await this._driverService.getGanancia(driver);
    console.log(ganancias);
    res.status(HttpStatus.OK).json(ganancias);
  }

  @Post('/reporte_ganancia/:uid')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async ReporteGanancia(
    @CurrentUser() user: CurrentUserDto,
    @Body() data: ReporteGananciasDto,
    @Param('uid') driver: string,
    @Res() res,
  ): Promise<any> {
    const report = await this._driverService.reporteGanancias(driver, data);
    res.status(HttpStatus.OK).json(report);
  }

  @Get('/reporte_liquidacion/:uid')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async ReporteLiquidacion(
    @CurrentUser() user: CurrentUserDto,
    @Param('uid') trip: string,
    @Res() res,
  ): Promise<any> {
    const report = await this._driverService.reporteLiquidacion(trip);
    res.status(HttpStatus.OK).json(report);
  }
}
