import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Put,
  Body,
  Res,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CurrentUser } from '../auth/CurrentUser.decorator';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { Trip } from './trip.entity';
import { CreateTripulationDto } from '../tripulation/dto/create.dto';
import { CreateTripDto, SearchTripsDto } from './dto/create-trip.dto';
import { JwtAuthGuard } from '../auth/jw-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('trip')
export class TripController {
  constructor(private _tripService: TripService) {}

  /**
   * async getById
   */
  @Get('/:uid')
  public async getById(
    @Param('uid') uid: string,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return await this._tripService.getById(uid);
  }
  /**
   * async getAll
   */
  @Get('/')
  public async getAll() {
    return await this._tripService.getAll();
  }

  @Get('/passengers/:uid')
  public async getpassengers(@Param('uid') uid: string, @Res() res) {
    const passengers = await this._tripService.getPassengers(uid);
    res.status(HttpStatus.OK).json({
      passengers: passengers,
    });
  }
  @Get('/manifiesto/:uid')
  public async getManifiesto(@Param('uid') uid: string, @Res() res) {
    const manifiesto = await this._tripService.getManifiesto(uid);
    res.status(HttpStatus.OK).json({
      manifiesto,
    });
  }
  /***
   *
   */
  @Post('/mytrips')
  @UseGuards(JwtAuthGuard)
  public async myTrips(
    @Res() res,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<void> {
    const trips = await this._tripService.myTrips(user);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      results: trips,
    });
  }
  /**
   * async createNew
   */
  @Post('/register')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  public async createNew(
    @Body() data: CreateTripDto,
    @CurrentUser() user: CurrentUserDto,
    @Res() res,
  ) {
    console.log(data);

    await this._tripService.createNew(data, user);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Trip registered successfully',
    });
  }
  /**
   * async delete
   */
  @Delete('/:uid')
  public async delete(
    @Param('uid') uid: string,
    @CurrentUser() user: CurrentUserDto,
    @Res() res,
  ) {
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Trip deleted successfully',
    });
  }
  /**
   * async updated
   */
  @Put('/:uid')
  public async updated(
    @Param('uid') uid: string,
    @CurrentUser() user: CurrentUserDto,
    @Body() data: Partial<CreateTripDto>,
  ): Promise<Trip> {
    return await this._tripService.update(uid, data);
  }

  @Post('/search_trips')
  public async search_trips(
    @Body() data: SearchTripsDto,
    @Res() res,
  ): Promise<void> {
    //console.log('HOLAAAAA HEMOS ENTRADO');
    const trips = await this._tripService.search_trips(data);
    console.log('search____', trips);

    res.status(HttpStatus.OK).json({
      status: 'OK',
      results: trips,
    });
  }

  @Post('/cancel_trip/:uid')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  public async cancel_trip(
    @Res() res,
    @Param('uid') uid: string,
  ): Promise<void> {
    const trips = await this._tripService.cancel_trip(uid);
    console.log('search____', trips);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'CANCELED',
    });
  }
}
