import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trip } from './trip.entity';
import { Repository, getConnection } from 'typeorm';
import { TripRepository } from './trip.repository';
import { CreateTripDto, SearchTripsDto } from './dto/create-trip.dto';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { Route } from '../route/route.entity';
import { Bus } from '../bus/bus.entity';
import { ReadSearchTripsDto } from './dto/read-trip.dto';
import moment = require('moment');
import { plainToClass } from 'class-transformer';
import { Ticket } from '../ticket/ticket.entity';
import { TypeBus } from '../bus/type-bus.enum';
import { BusNormal } from '../bus/bus-normal.entity';
import { BusDp } from '../bus/Bus-doblepiso.entity';
import { SaleOnline } from '../sale/sale_online.entity';
import { Person } from '../person/person.entity';
import { TravelStatus } from './enum/travel-status.enum';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip) private _tripRepository: TripRepository,
  ) {}
  /**
   * async getById
   */
  public async getById(uid: string): Promise<any> {
    const trip = await this._tripRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('trip.origin', 'origin')
      .leftJoinAndSelect('trip.destination', 'destination')
      .where('trip.idTrip = :id', { id: uid })
      .getOne();
    return trip;
  }
  /**
   * async getAll
   */
  public async getAll(): Promise<any[]> {
    const trip = await this._tripRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('trip.origin', 'origin')
      .leftJoinAndSelect('trip.destination', 'destination')
      .leftJoinAndSelect('bus.driver', 'driver')
      .leftJoinAndSelect('driver.staff', 'staff')
      .where('trip.status != :status', { status: TravelStatus.CANCELED })
      .leftJoinAndSelect('staff.person', 'person')
      .getMany();

    return trip;
  }
  /**
   * async createNew
   */
  public async createNew(
    data: CreateTripDto,
    user: CurrentUserDto,
  ): Promise<void> {
    await this._tripRepository.createNew(data, user);
  }
  /**
   * async apda
   */
  public async update(uid: string, data: Partial<CreateTripDto>): Promise<any> {
    // const trip = await this.getById(uid);
    // if (!trip) {
    //   throw new NotFoundException('trip does not exists');
    // }
    // return await this._tripRepository.update(uid, data);
  }
  /**
   * search_trips
   */
  public async search_trips(
    data: SearchTripsDto,
  ): Promise<ReadSearchTripsDto[]> {
    console.log(data);

    const trip = await this._tripRepository
      .createQueryBuilder('trip')
      // .addSelect('origin.*', 'origin')
      // .addSelect('destination.*', 'destination')
      // .addSelect('trip.*', 'trip')
      // .addSelect('bus.type_bus', 'bus')
      .leftJoinAndSelect('trip.origin', 'origin')
      .leftJoinAndSelect('trip.destination', 'destination')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('bus.driver', 'driver')
      .leftJoinAndSelect('driver.staff', 'staff')
      .leftJoinAndSelect('staff.person', 'person')
      .leftJoinAndSelect('bus.bus_normal', 'normal')
      .leftJoinAndSelect('bus.bus_doble', 'doble')
      .where('trip.departure_date = :date', { date: data.departure_date })
      .andWhere('origin.city = :origin', { origin: data.origin })
      .andWhere('destination.city = :destination', {
        destination: data.destination,
      })
      .andWhere('trip.status = :status', {
        status: TravelStatus.ON_HOLD,
      })
      // .andWhere('trip.status != :status', {
      //   status: TravelStatus.FINISHED,
      // })
      // .andWhere('trip.status != :status', {
      //   status: TravelStatus.IN_PROCESS,
      // })
      .getMany();

    let result_search = [];
    // trip.map((t) => {
    //   console.log('21222222222222222', t);
    // });
    //await Promise.all(trip.map(e => e));
    let results = await trip.map(async (e) => {
      let tickets;
      let bus;
      tickets = await getConnection()
        .getRepository(Ticket)
        .createQueryBuilder('ticket')
        .where('ticket.trip = :id', { id: e.idTrip })
        .getMany();
      if (e.bus.type_bus == TypeBus.DOBLE_PISO) {
        console.log('DOBLE PISO');

        bus = await getConnection()
          .getRepository(BusDp)
          .findOne({ where: { idBusdp: e.bus.idBus } });
      } else {
        console.log('PISO simple');
        bus = await getConnection()
          .getRepository(BusNormal)
          .findOne({ where: { idBus_normal: e.bus.idBus } });
      }

      return Promise.all([tickets, bus]).then((values) => {
        let vendidos;
        let libres;
        let disponibles;
        vendidos = values[0].length;
        if (e.bus.type_bus == TypeBus.DOBLE_PISO) {
          libres = values[1].NA_P2 + values[1].NA_P1;
        } else {
          libres = values[1].nro_seats;
        }

        disponibles = libres - vendidos;
        let piso1 = 0;
        let piso2 = 0;
        let piso = 0;
        if(e.mode == 'PANDEMIA'){
            if(e.bus.type_bus == TypeBus.DOBLE_PISO){
             
                if(e.bus.bus_doble.NF_P1 == 3){
                   piso1 =  e.bus.bus_doble.NA_P1/3;
                }else{
                  piso1 =  e.bus.bus_doble.NA_P1/2;
                }
                if(e.bus.bus_doble.NF_P2 == 3){
                  piso2 =  e.bus.bus_doble.NA_P2/3;
               }else{
                 piso2 =  e.bus.bus_doble.NA_P2/2;
               }
              
            }else{
              if(e.bus.bus_normal.nro_rows == 3){
                piso =  e.bus.bus_normal.nro_seats/3;
             }else{
               console.log('ESTAMOS EN CALIFORMIA',e.bus.bus_normal.nro_seats);
               
               piso =  e.bus.bus_normal.nro_seats/2;
             }
            }
        }
        disponibles = disponibles - piso1 - piso2 - piso;
        libres = values[0].length;
        return {
          id_trip: e.idTrip,
          avaliable_seats: disponibles,
          bus: e.bus.type_bus,
          duration: e.duration,
          departure_date: e.departure_date,
          departure_time: e.departure_time,
          arrival_date: e.arrival_date,
          arrival_time: e.arrival_time,
          origin: e.origin,
          placa_bus: e.bus.plate_number,
          driver: `${e.bus.driver.staff.person.name} ${e.bus.driver.staff.person.lastname}`,
          destination: e.destination,
          price_online: e.price_online,
        };
        // result_search.push({
        //   id_trip: e.idTrip,
        //   avaliable_seats: libres - vendidos,
        //   bus: e.bus.type_bus,
        //   duration: e.duration,
        //   departure_date: e.departure_date,
        //   departure_time: e.departure_time,
        //   origin: e.origin,
        //   destination: e.destination,
        //   price_online: e.price_online,
        // });
      });
    });

    //const resp =
    // trip.forEach((e) => {
    //   result_search.push({
    //     id_trip: e.idTrip,
    //     avaliable_seats: vendidos,
    //     bus: e.bus.type_bus,
    //     duration: e.duration,
    //     departure_date: e.departure_date,
    //     departure_time: e.departure_time,
    //     origin: e.origin,
    //     destination: e.destination,
    //     price_online: e.price_online,
    //   });
    // });

    // trip.forEach((e)=>{
    //   e.origin.city
    // })
    // var date = moment('15-06-2010', 'DD-MM-YYYY')
    // console.log(date.format('MM-DD-YYYY'))
    return plainToClass(
      ReadSearchTripsDto,
      await Promise.all(results).then((values) => {
        values.forEach((e) => {
          result_search.push(e);
        });
        return result_search;
      }),
    );
  }

  /**
   * async myTrips
   */
  public async myTrips(user: CurrentUserDto): Promise<any[]> {
    let results = [];
    // const trips = await
    //                 this._tripRepository
    //                 .createQueryBuilder('trip')
    //                 .leftJoinAndSelect('trip.origin', 'origin')
    //                 .leftJoinAndSelect('trip.destination', 'destination')
    //                 .leftJoinAndSelect('trip.ticket', 'ticket')
    //                 .leftJoinAndSelect('ticket.sale_detail', 'sd')
    //                 .leftJoinAndSelect('sd.sale','sale')
    //                 .leftJoinAndSelect('sale')
    const sale_online = await getConnection()
      .getRepository(SaleOnline)
      .createQueryBuilder('so')
      .leftJoinAndSelect('so.user', 'user')
      .leftJoinAndSelect('so.sale', 'sale')
      .leftJoinAndSelect('sale.sale_detail', 'sd')
      .leftJoinAndSelect('sd.ticket', 'ticket')
      .leftJoinAndSelect('ticket.trip', 'trip')
      .leftJoinAndSelect('trip.origin', 'origin')
      .leftJoinAndSelect('trip.destination', 'destination')
      .where('user.idUser = :id', { id: user.id })
      .getMany();
    console.log('dfghjk', sale_online);

    sale_online.forEach((e) => {
      console.log(e.sale);

      results.push({
        code_trip: e.sale.sale_detail[0].ticket.trip.codigo_trip,
        carril: e.sale.sale_detail[0].ticket.trip.carril,
        departure_date: e.sale.sale_detail[0].ticket.trip.departure_date,
        departure_time: e.sale.sale_detail[0].ticket.trip.departure_time,
        origin: e.sale.sale_detail[0].ticket.trip.origin.city,
        destination: e.sale.sale_detail[0].ticket.trip.destination.city,
        price: e.sale.sale_detail[0].ticket.trip.price_online,
        nro_seats: e.sale.sale_detail.map((detail) => {
          return detail.ticket.nro_seat;
        }),
      });
    });
    console.log('resultsados..................', results);

    return results;
  }
  /**
   * passengers
   */
  public async getManifiesto(idTrip): Promise<any> {
    // let passengers = [];
    // let manifiesto = [];

    const pass = await this._tripRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.ticket', 'ticket')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('bus.driver', 'driver')
      .leftJoinAndSelect('driver.staff', 'staff')
      .leftJoinAndSelect('staff.person', 'person')
      .leftJoinAndSelect('ticket.passenger', 'passenger')
      .leftJoinAndSelect('trip.destination', 'destination')
      .leftJoinAndSelect('trip.origin', 'origin')
      .where('trip.idTrip = :id', { id: idTrip })
      .getOne();

    let passengers = pass.ticket.map((i) => {
      let passenger = {
        name: i.passenger.name,
        lastname: i.passenger.lastname,
        document: i.passenger.document,
        type_doc: i.passenger.type_doc,
        price_ticket: i.sale_price,
        codigo_ticket: i.code,
        nro_seat: i.nro_seat,
      };
      return passenger;
    });

    const data = {
      nro_plate: pass.bus.plate_number,
      socio: `${pass.bus.driver.staff.person.name} ${pass.bus.driver.staff.person.lastname}`,
      departure_date: pass.departure_date,
      departure_time: pass.departure_time,
      code_trip: pass.codigo_trip,
      ruta: `${pass.origin.city} - ${pass.destination.city}`,
      passengers: passengers,
    };
    // e.ticket.forEach((i) => {
    //   passengers.push({
    //     name: i.passenger.name,
    //     lastname: i.passenger.lastname,
    //     document: i.passenger.document,
    //     type_doc: i.passenger.type_doc,
    //     price_ticket: i.sale_price,
    //     codigo_ticket: i.code,
    //     nro_seat: i.nro_seat,
    //   });
    // });

    return data;
  }
  /**
   * passengers
   */
  public async getPassengers(idTrip): Promise<any[]> {
    let passengers = [];

    const pass = await this._tripRepository
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.ticket', 'ticket')
      .leftJoinAndSelect('ticket.passenger', 'passenger')
      .where('trip.idTrip = :id', { id: idTrip })
      .getMany();
    pass.forEach((e) => {
      e.ticket.forEach((i) => {
        passengers.push({
          name: i.passenger.name,
          lastname: i.passenger.lastname,
          document: i.passenger.document,
          type_doc: i.passenger.type_doc,
          price_ticket: i.sale_price,
          codigo_ticket: i.code,
          nro_seat: i.nro_seat,
        });
      });
    });
    return passengers;
  }

  /**
   *
   */
  public async cancel_trip(idTrip: string): Promise<void> {
    const trip = await this._tripRepository.findOne(idTrip);
    trip.status = TravelStatus.CANCELED;
    await trip.save();
  }
}
