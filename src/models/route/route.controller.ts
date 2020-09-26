import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Body,
  Post,
  Res,
  HttpStatus,
  Query,
  ValidationPipe,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { RouteService } from './route.service';
import { CreateRouteDto, routes_filter } from './dto/create-route.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('route')
export class RouteController {
  constructor(private _routeService: RouteService) {}
  @Get('/destinos')
  public async getDestinies(
    @Res() res,
    @Query(ValidationPipe) query: routes_filter,
  ) {
    const routes = await this._routeService.getDestinies(query);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      results: routes,
    });
  }

  @Get('/get_routes')
  public async getRoutes(@Res() res) {
    const routes = await this._routeService.getRoutes();
    console.log(routes);

    res.status(HttpStatus.OK).json({
      status: 'OK',
      results: routes,
    });
  }
  /**
   * async getById
   */
  @Get('/:uid')
  public async getById(@Param('uid', ParseUUIDPipe) uid: string) {
    return await this._routeService.getById(uid);
  }
  /**
   * async getAll
   */
  @Get('/')
  public async getAll() {
    return await this._routeService.getAll();
  }
  /**
   * async createNew
   */
  @Post('register')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  public async createNew(@Body() data: CreateRouteDto, @Res() res) {
    await this._routeService.createNewRoute(data);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Route created successfully',
    });
  }
  /**
   * async getAll
   */
}
