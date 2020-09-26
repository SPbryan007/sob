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
import { BusService } from './bus.service';
import { CreateBusNormalDto, CreateBusDPDto } from './dto/create-bus.dto';
import { CurrentUser } from '../auth/CurrentUser.decorator';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { Roles } from '../role/decorators/role.decorator';
import { RoleType } from '../role/roletype.enum';
import { JwtAuthGuard } from '../auth/jw-auth.guard';
import { RoleGuard } from '../role/guards/role.guard';
import { AuthGuard } from '@nestjs/passport';
// import { AppGateway } from 'src/app.gateway';

@Controller('bus')
export class BusController {
  constructor(private _busService: BusService) {}

  
  @Get('/information/all')
  public async  getAllInformacion(
    @Res() res,
  ): Promise<void> {
    const info = await this._busService.getAllInformacion();
    res.status(HttpStatus.OK).json({
      info
    });
  }
  @Get('/getbuses')
  public async getBuses(
    // @CurrentUser() user: CurrentUserDto,
    @Res() res,
  ): Promise<void> {
    console.log('entrooooooooo');
    const buses = await this._busService.getBuses();
    res.status(HttpStatus.OK).json({
      status: 'OK',
      buses,
    });
  }

  /**
   * async Get
   */
  @Get('/:uid')
  public async getById(
    @Param('uid') id: string,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<any> {
    return await this._busService.getById(id);
  }
  /**
   * async Get
   */
  // @Get('/')
  // public async getAll(@CurrentUser() user: CurrentUserDto): Promise<any> {
  //   return await this._busService.getAll();
  // }
  /**
   * async Get
   */

  @Get('/')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async getAll(@CurrentUser() user: CurrentUserDto): Promise<any> {
    return await this._busService.getAll();
  }

  /**
   * async createNew Bus normal
   */
  @Post('/register/normal/:uid')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async createNewNormal(
    @Param('uid') uid: string,
    @Body() data: CreateBusNormalDto,
    @Res() res,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<void> {
    console.log('body', data);

    await this._busService.createNewBusNormal(data, uid);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Bus created successfully',
    });
  }
  /**
   * async createNew Bus doble piso
   */
  @Post('/register/doble/:uid')
  @UsePipes(ValidationPipe)
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  public async createNewDP(
    @Param('uid') uid: string,
    @Res() res,
    @CurrentUser() user: CurrentUserDto,
    @Body() data: CreateBusDPDto,
  ): Promise<void> {
    await this._busService.createNewBusDP(data, uid);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Bus created successfully',
    });
  }

  @Get('/information/:uid')
  public async search_trips(
    @Param('uid') trip: string,
    @Res() res,
  ): Promise<void> {
    // let hola = {
    //   ...this._getway.plantilla[`${trip}`]
    // }
    // console.log('hola...............',this._getway);
    
    // res.status(HttpStatus.OK).json({
    //   ...this._getway.plantilla[`${trip}`]
    // })
    const info = await this._busService.getInformation(trip);
    res.status(HttpStatus.OK).json({
      price_online: info.price_online,
      type_bus: info.type_bus,
      departure_time: info.departure_time,
      departure_date: info.departure_date,
      terminal_origin: info.terminal_origin,
      terminal_destination: info.terminal_destination,
      carril: info.carril,
      ocupados:info.ocupados,
      planta_alta: info.planta_alta,
      planta_baja: info.planta_baja,
    });
  }

 
  // @Get('/obtener')
  // // @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  // // @UseGuards(JwtAuthGuard, RoleGuard)
  // // @UsePipes(ValidationPipe)
  // @UseGuards(AuthGuard())
  // public async getBuses(
  //   // @CurrentUser() user: CurrentUserDto,
  //   @Res() res,
  // ): Promise<void> {
  //   console.log('entrooooooooo');

  //   //const buses = await this._busService.getBuses();
  //   // res.status(HttpStatus.OK).json({
  //   //   status: 'OK',
  //   //   buses,
  //   // });
  // }
}
