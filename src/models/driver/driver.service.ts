import { Injectable } from '@nestjs/common';
import { Driver } from './driver.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DriverRepository } from './driver.repository';
import { getConnection } from 'typeorm';
import { Sale } from '../sale/sale.entity';
import { Trip } from '../trip/trip.entity';
import { TravelStatus } from '../trip/enum/travel-status.enum';
import { ReporteGananciasDto } from './dto/create-driver.dto';

@Injectable()
export class DriverService {
  constructor(
    @InjectRepository(Driver) private _driverRepository: DriverRepository,
  ) {}
  /**
   * name
   */
  public async getGanancia(driver): Promise<any[]> {
    let ganancias = [];

    const trips = await getConnection()
      .getRepository(Trip)
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.ticket', 'ticket')
      .leftJoinAndSelect('ticket.sale_detail', 'sd')
      .leftJoinAndSelect('trip.origin', 'origin')
      .leftJoinAndSelect('trip.destination', 'destination')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('bus.driver', 'driver')
      .where('driver.idDriver = :id', { id: driver })
      .where('driver.idDriver = :id', { id: driver })
      .andWhere('trip.status != :status', { status: TravelStatus.CANCELED })
      .getMany();

    trips.forEach((e) => {
      let total = 0;
      e.ticket.forEach((e) => {
        total = total + e.sale_price;
      });

      ganancias.push({
        codigo: e.codigo_trip,
        route: `${e.origin.city} - ${e.destination.city} `,
        fecha: e.departure_date,
        price: e.price_online,
        sale_seats: e.ticket.length,
        total: total,
      });
    });

    return ganancias;
  }

  /**
   * reporteGanancias
   */
  public async reporteGanancias(
    driver: string,
    body: ReporteGananciasDto,
  ): Promise<any> {
    let ganancias = [];
    let todo = 0;
    const socio = await this._driverRepository
      .createQueryBuilder('driver')
      .leftJoinAndSelect('driver.staff', 'staff')
      .leftJoinAndSelect('staff.person', 'person')
      .leftJoinAndSelect('driver.bus', 'bus')
      .where('driver.idDriver = :id', { id: driver })
      .getOne();
    const trips = await getConnection()
      .getRepository(Trip)
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.ticket', 'ticket')
      .leftJoinAndSelect('ticket.sale_detail', 'sd')
      .leftJoinAndSelect('trip.origin', 'origin')
      .leftJoinAndSelect('trip.destination', 'destination')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('bus.driver', 'driver')
      .leftJoinAndSelect('driver.staff', 'staff')
      .leftJoinAndSelect('staff.person', 'person')
      .where('driver.idDriver = :id', { id: driver })
      .andWhere('trip.departure_date BETWEEN :from AND :to', {
        from: body.from,
        to: body.to,
      })
      .andWhere('trip.status != :status', { status: TravelStatus.CANCELED })
      .getMany();

    trips.forEach((e) => {
      let total = 0;
      e.ticket.forEach((e) => {
        total = total + e.sale_price;
      });
      todo += total;
      ganancias.push({
        codigo: e.codigo_trip,
        route: `${e.origin.city} - ${e.destination.city} `,
        fecha: e.departure_date,
        price: e.price_online,
        sale_seats: e.ticket.length,
        total: total,
      });
    });

    let pro_adm = trips.length * 30; //(todo * 0.3).toFixed(2);
    let prevision = trips.length * 10; //(todo * 0.1).toFixed(2);
    let iva = (todo * 0.16).toFixed(2);
    let seguro = trips.length * 15; //(todo * 0.15).toFixed(2);
    let total2 = todo - (pro_adm + prevision + seguro + todo * 0.16); // (todo * 0.3 + todo * 0.1 + todo * 0.16 + todo * 0.15);
    let data = {
      socio: `${socio.staff.person.name} ${socio.staff.person.lastname}`,
      bus: socio.bus.plate_number,
      from: body.from,
      to: body.to,
      ganancias,
      total1: todo,
      pro_adm,
      prevision,
      iva,
      seguro,
      total2: total2.toFixed(2),
    };

    return data;
  }

  public async reporteLiquidacion(trip: string): Promise<any> {
    let ganancias = [];
    let todo = 0;
    // const socio = await this._driverRepository
    //   .createQueryBuilder('driver')
    //   .leftJoinAndSelect('driver.staff', 'staff')
    //   .leftJoinAndSelect('staff.person', 'person')
    //   .leftJoinAndSelect('driver.bus', 'bus')
    //   .where('driver.idDriver = :id', { id: driver })
    //   .getOne();
    const liquidacion = await getConnection()
      .getRepository(Trip)
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.ticket', 'ticket')
      .leftJoinAndSelect('ticket.sale_detail', 'sd')
      .leftJoinAndSelect('trip.origin', 'origin')
      .leftJoinAndSelect('trip.destination', 'destination')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('bus.driver', 'driver')
      .leftJoinAndSelect('driver.staff', 'staff')
      .leftJoinAndSelect('staff.person', 'person')
      .where('trip.idTrip = :id',{id:trip})
      .andWhere('trip.status != :status', { status: TravelStatus.CANCELED })
      .getOne();

    let total = 0;
    liquidacion.ticket.forEach((e) => {
      total = total + e.sale_price;
    });

    // trips.forEach((e) => {
    //   let total = 0;
    //   e.ticket.forEach((e) => {
    //     total = total + e.sale_price;
    //   });
    //   todo += total;
    //   ganancias.push({
    //     codigo: e.codigo_trip,
    //     route: `${e.origin.city} - ${e.destination.city} `,
    //     fecha: e.departure_date,
    //     price: e.price_online,
    //     sale_seats: e.ticket.length,
    //     total: total,
    //   });
    // });

    let pro_adm = 30; //(todo * 0.3).toFixed(2);
    let prevision = 10; //liquidacion.ticket.length * 10; //(todo * 0.1).toFixed(2);
    let iva = (total * 0.16).toFixed(2);
    let seguro = 15; //(todo * 0.15).toFixed(2);
    let total2 = total - (pro_adm + prevision + seguro + total * 0.16); // (todo * 0.3 + todo * 0.1 + todo * 0.16 + todo * 0.15);
    let data = {
      seats: liquidacion.ticket.length,
      price: liquidacion.price_online,
      date: liquidacion.departure_date,
      code: liquidacion.codigo_trip,
      ruta: `${liquidacion.destination.city}`,
      socio: `${liquidacion.bus.driver.staff.person.name} ${liquidacion.bus.driver.staff.person.lastname}`,
      bus: liquidacion.bus.plate_number,
      total1: total,
      pro_adm,
      prevision,
      iva,
      seguro,
      total2: total2.toFixed(2),
    };

    return data;
  }
}
