import { Repository, EntityRepository } from 'typeorm';
import { Route } from './route.entity';
import { CreateRouteDto, routes_filter } from './dto/create-route.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ReadRouteDto } from './dto/read-route.dto';

@EntityRepository(Route)
export class RouteRepository extends Repository<Route> {
  async createNew(data: CreateRouteDto): Promise<Route> {
    const route = new Route();
    route.city = data.city;
    route.terminal = data.terminal;
    route.address = data.address;
    try {
      return await route.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong trying to save a route',
      );
    }
  }
  async getRoutes(filterDto: routes_filter): Promise<ReadRouteDto[]> {
    const word = filterDto.query.toLowerCase();

    const query = this.createQueryBuilder('route');
    if (word) {
      query.andWhere('(LOWER(route.city) LIKE :search)', {
        search: `%${word}%`,
      });
    }
    try {
      const routes = await query.getMany();
      return plainToClass(ReadRouteDto, routes);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
