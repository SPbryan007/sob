import { Repository, EntityRepository, getConnection } from 'typeorm';
import { Trip } from './trip.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { Bus } from '../bus/bus.entity';
import { Route } from '../route/route.entity';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
const RandomCodes = require('random-codes');
const rc = new RandomCodes({
  // A string containing available chars
  chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  separator: '-',
  mask: '*',

  // Number of parts the code contains
  parts: 2,

  // Size of each part
  part_size: 3,

  // Function used to get a random char from the chars pool
  // (Please use a better one)
  getChar: function (pool) {
    var random = Math.floor(Math.random() * pool.length);
    return pool.charAt(random);
  },
});

@EntityRepository(Trip)
export class TripRepository extends Repository<Trip> {
  /**
   * async
   */

  async createNew(data: CreateTripDto, user: CurrentUserDto): Promise<void> {
    const bus = await getConnection().getRepository(Bus).findOne(data.idBus);
    if (!bus) {
      throw new NotFoundException('Bus does does not exists');
    }
    const origin = await getConnection()
      .getRepository(Route)
      .findOne(data.idOrigin);
    if (!origin) {
      throw new NotFoundException('Route origin does not exists');
    }
    const destination = await getConnection()
      .getRepository(Route)
      .findOne(data.idDestination);
    if (!destination) {
      throw new NotFoundException('Route destination does  not exists');
    }
    const trip = new Trip();
    trip.origin = origin;
    trip.destination = destination;
    trip.bus = bus;
    trip.duration = data.duration;
    trip.departure_date = data.departure_date;
    trip.departure_time = data.departure_time;
    trip.arrival_date = data.arrival_date;
    trip.arrival_time = data.arrival_time;
    trip.max_price = data.max_price;
    trip.min_price = data.min_price;
    trip.price_online = data.price_online;
    trip.carril = data.carril;
    trip.mode = data.mode ? 'PANDEMIA' : 'NORMAL';
    trip.codigo_trip = rc.generate();

    console.log('THIS IS DE NEW TRIP........', trip);

    try {
      await trip.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Something went wrong trying to save a new trip',
      );
    }
  }
}
