import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Route } from './route.entity';
import { RouteRepository } from './route.repository';
import { ReadRouteDto } from './dto/read-route.dto';
import { CreateRouteDto, routes_filter } from './dto/create-route.dto';
import { query } from 'express';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Route)
    private _routeRepository: RouteRepository,
  ) {}

  /**
   * getById method
   */
  public async getById(uid: string): Promise<ReadRouteDto> {
    return await this._routeRepository.findOne(uid);
  }

  /**
   *
   */
  public async getAll(): Promise<ReadRouteDto[]> {
    return await this._routeRepository.find();
  }
  /**
   * async createNewRoute
   */
  public async createNewRoute(data: CreateRouteDto): Promise<ReadRouteDto> {
    return this._routeRepository.createNew(data);
  }
  /**
   * getDestinies
   */
  public async getDestinies(query: routes_filter): Promise<ReadRouteDto[]> {
    return this._routeRepository.getRoutes(query);
    // const routes = await this._routeRepository.find();
    // let rutas = [];
    // routes.forEach((item) => {
    //   if (!rutas.includes(item.city)) {
    //     rutas.push(item.city);
    //   }
    // });
    // return rutas;
  }
  /**
   * getRoutes
   */
  public async getRoutes() {
    return await this._routeRepository.find();
  }
}
