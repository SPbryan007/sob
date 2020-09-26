import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusRepository } from './busRepository';
import { Bus } from './bus.entity';
import { ReadBusDto } from './dto/read-bus.dto';
import { CreateBusNormalDto, CreateBusDPDto } from './dto/create-bus.dto';
import { BusNormal } from './bus-normal.entity';
import { BusDp } from './Bus-doblepiso.entity';
import { getRepository, getConnection } from 'typeorm';
import { Ticket } from '../ticket/ticket.entity';
import { Trip } from '../trip/trip.entity';
import { PlanillaInfo } from './dto/bus-info.interface';
import { Driver } from '../driver/driver.entity';

@Injectable()
export class BusService {
  constructor(@InjectRepository(Bus) private _busRepository: BusRepository
  ) {}
  /**
   * async getById
   */
  public async getById(uid: string): Promise<any> {
    const bus = await this._busRepository
      .createQueryBuilder('bus')
      .innerJoin(BusNormal, 'bn', 'bn.busIdBus = bus.idBus')
      .innerJoin(BusDp, 'bdp', 'bdp.busidBus = bus.idBus')
      .where('bus.idBus = :id', { id: uid })
      .getOne();
    console.log('bus', bus);
    return bus;
  }

  public async getBuses(): Promise<any> {
    const buses = await this._busRepository
      .createQueryBuilder('bus')
      .leftJoinAndSelect('bus.bus_normal', 'bn')
      .leftJoinAndSelect('bus.bus_doble', 'bd')
      .leftJoinAndSelect('bus.driver', 'driver')
      .leftJoinAndSelect('driver.staff', 'staff')
      .leftJoinAndSelect('staff.person', 'person')
      .getMany();
    console.log(buses);

    return buses;
  }

  /**
   * async getAll
   */
  // public async getAll(): Promise<any[]> {
  //   const bus = await this._busRepository
  //     .createQueryBuilder('bus')
  //     .leftJoinAndSelect('bus.bus_doble', 'doble')
  //     .leftJoinAndSelect('bus.bus_normal', 'normal')
  //     .getMany();
  //   console.log('bus', bus);
  //   return bus;
  //   // return await this._busRepository.find();
  // }
  /**
   * async getAll
   */
  public async getAll(): Promise<any> {
    let buses = [];
    let socios = [];
    const bus = await this._busRepository
      .createQueryBuilder('bus')
      .leftJoinAndSelect('bus.driver', 'driver')
      .leftJoinAndSelect('driver.staff', 'staff')
      .leftJoinAndSelect('staff.person', 'person')
      .getMany();
    const socio = await getConnection()
      .getRepository(Driver)
      .createQueryBuilder('driver')
      .leftJoinAndSelect(
        'driver.bus',
        'bus',
        'bus.driverIdDriver != driver.idDriver',
      )
      .leftJoinAndSelect('driver.staff', 'staff')
      .leftJoinAndSelect('staff.person', 'person')
      //.where('bus.driverIdDriver != driver.idDriver')
      .getMany();

    bus.forEach((e) => {
      buses.push({
        idBus: e.idBus,
        plate_number: e.plate_number,
        type_bus: e.type_bus,
        socio: `${e.driver.staff.person.name} ${e.driver.staff.person.lastname} `,
      });
    });

    socio.forEach((e) => {
      socios.push({
        idDriver: e.idDriver,
        driver: `${e.staff.person.name} ${e.staff.person.lastname} `,
      });
    });
    const data = {
      bus_list: buses,
      socios: socios,
    };
    return data;
    // return await this._busRepository.find();
  }
  /**
   * async
   */

  public async createNewBusNormal(
    data: CreateBusNormalDto,
    uid: string,
  ): Promise<void> {
    await this._busRepository.createBusNormal(data, uid);
  }
  /**
   * async
   */
  public async createNewBusDP(
    data: CreateBusDPDto,
    uid: string,
  ): Promise<void> {
    await this._busRepository.createBusDP(data, uid);
  }

  public async getInformation(uid: string): Promise<PlanillaInfo> {
    // const bus = await this._busRepository
    //   .createQueryBuilder('trip')
    //   .leftJoinAndSelect('bus.trip', 'trip')
    //   .where('trip.idTrip = :trip', { trip: uid })
    //   .getOne();
    const trip = await getConnection()
      .getRepository(Trip)
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('trip.origin', 'origin')
      .leftJoinAndSelect('trip.destination', 'destination')
      .where('trip.idTrip = :id', { id: uid })
      .getOne();

    const tickets = await getConnection()
      .getRepository(Ticket)
      .createQueryBuilder('ticket')
      .where('ticket.trip = :id', { id: uid })
      .getMany();
    let vendidos = [];
    tickets.forEach((e) => {
      vendidos.push(e.nro_seat);
    });

    // .addSelect('origin.*', 'origin')
    // .addSelect('destination.*', 'destination')
    // .addSelect('trip.*', 'trip')
    // .addSelect('bus.type_bus', 'bus')
    // .leftJoinAndSelect('bus.origin', 'origin')
    // .leftJoinAndSelect('trip.destination', 'destination')
    // .leftJoinAndSelect('trip.bus', 'bus')
    // .where('trip.departure_date = :date', { date: data.departure_date })
    // .andWhere('origin.city = :origin', { origin: data.origin })
    // .andWhere('destination.city = :destination', {
    //   destination: data.destination,
    // })
    // .getMany();
    let tipo_asiento_planta_alta;
    let tipo_asiento_planta_baja;
    let nro_asientos_planta_alta;
    let nro_asientos_planta_baja;
    let filas_planta_alta;
    let filas_planta_baja;
    let columnas_planta_alta;
    let columnas_planta_baja;
    let array_columnas_planta_alta;
    let array_columnas_planta_baja;

    if (trip.bus.type_bus == 'PANORAMICO') {
      const panoramico = await this._busRepository
        .createQueryBuilder('bus')
        .leftJoinAndSelect('bus.bus_normal', 'normal')
        .where('bus.idBus = :id', { id: trip.bus.idBus })
        .getOne();
      tipo_asiento_planta_alta = panoramico.bus_normal.nro_rows == 4 ? 2 : 1;
      nro_asientos_planta_alta = panoramico.bus_normal.nro_seats;
      columnas_planta_alta = 2 + tipo_asiento_planta_alta;
      filas_planta_alta = nro_asientos_planta_alta / columnas_planta_alta;
      array_columnas_planta_alta =
        columnas_planta_alta == 4 ? [-3, -2, 'x', 0, -1] : [-3, -2, 'x', -1];
    }

    if (trip.bus.type_bus == 'DOBLE_PISO') {
      const doble = await this._busRepository
        .createQueryBuilder('bus')
        .leftJoinAndSelect('bus.bus_doble', 'doble')
        .where('bus.idBus = :id', { id: trip.bus.idBus })
        .getOne();

      tipo_asiento_planta_baja = doble.bus_doble.NF_P1 == 4 ? 2 : 1;
      tipo_asiento_planta_alta = doble.bus_doble.NF_P2 == 4 ? 2 : 1;

      nro_asientos_planta_baja = doble.bus_doble.NA_P1;
      columnas_planta_baja = 2 + tipo_asiento_planta_baja;
      filas_planta_baja = nro_asientos_planta_baja / columnas_planta_baja;
      array_columnas_planta_baja =
        columnas_planta_baja == 4 ? [-3, -2, 'x', 0, -1] : [-2, -1, 'x', 0];

      nro_asientos_planta_alta = doble.bus_doble.NA_P2;
      columnas_planta_alta = 2 + tipo_asiento_planta_alta;
      filas_planta_alta = nro_asientos_planta_alta / columnas_planta_alta;
      array_columnas_planta_alta =
        columnas_planta_alta == 4 ? [-3, -2, 'x', 0, -1] : [-2, -1, 'x', 0];
    }

    let filas_pa = 0;
    let filas_pb = 0;

    for (let index = 0; index < filas_planta_alta; index++) {
      let n = Math.abs(filas_planta_alta);
      let decimal = n - Math.floor(n);
      filas_pa += decimal;
    }

    for (let index = 0; index < filas_planta_baja; index++) {
      let n = Math.abs(filas_planta_alta);
      let decimal = n - Math.floor(n);
      filas_pb += decimal;
    }
    for (let index = 0; index < filas_pa; index++) {}

    for (let index = 0; index < filas_pb; index++) {}

    // Math.round();
    let planta_alta = [];
    let planta_baja = [];
    console.log('PADEMIAAAAAAAAAAAAA',trip.mode);
    
    let pandemia_mode = trip.mode == 'PANDEMIA' ? true : false;
    let ocupados = 0;
    /***
     * PLANTA ALTA
     */
    let mayor = 0;
    for (let j = 0; j < array_columnas_planta_alta.length; j++) {
      let seats = [];
      let nro = 0;

      for (let i = 1; i <= filas_planta_alta; i++) {
        if (j == 2) {
          seats.push({
            object: 'pasillo',
            status: 'pasillo',
            nro_seat: '',
          });
        } else {
          if (pandemia_mode) {
            if (array_columnas_planta_alta.length == 4) {
              if (j == 1) {
                nro =
                  array_columnas_planta_alta.length == 4
                    ? array_columnas_planta_alta[j] + 3
                    : array_columnas_planta_alta[j] + 4;
                seats.push({
                  object: 'asiento',
                  status: 'ocupado',
                  nro_seat: nro.toString(),
                });
                ocupados += 1;
              } else {
                nro =
                  array_columnas_planta_alta.length == 4
                    ? array_columnas_planta_alta[j] + 3
                    : array_columnas_planta_alta[j] + 4;
                seats.push({
                  object: 'asiento',
                  status: vendidos.includes(nro) ? 'ocupado' : 'disponible',
                  nro_seat: nro.toString(),
                });
              }
            } else {
              if (j == 1 || j == 3) {
                nro =
                  array_columnas_planta_alta.length == 4
                    ? array_columnas_planta_alta[j] + 3
                    : array_columnas_planta_alta[j] + 4;
                seats.push({
                  object: 'asiento',
                  status: 'ocupado',
                  nro_seat: nro.toString(),
                });
                ocupados += 1;
              } else {
                nro =
                  array_columnas_planta_alta.length == 4
                    ? array_columnas_planta_alta[j] + 3
                    : array_columnas_planta_alta[j] + 4;
                seats.push({
                  object: 'asiento',
                  status: vendidos.includes(nro) ? 'ocupado' : 'disponible',
                  nro_seat: nro.toString(),
                });
              }
            }
          }else {
            nro =
              array_columnas_planta_alta.length == 4
                ? array_columnas_planta_alta[j] + 3
                : array_columnas_planta_alta[j] + 4;
            seats.push({
              object: 'asiento',
              status: vendidos.includes(nro) ? 'ocupado' : 'disponible',
              nro_seat: nro.toString(),
            });
          }
        }
        array_columnas_planta_alta[j] = nro;
        if (nro > mayor) {
          mayor = nro;
        }
      }
      planta_alta.push(seats);
    }

    /***
     * PLANTA BAJA
     */
    if (trip.bus.type_bus == 'DOBLE_PISO') {
      /**
       * INICIO DE PLANTA BAJA
       */
      let col_pb = [];
      if (
        array_columnas_planta_alta.length == 5 &&
        array_columnas_planta_baja.length == 5
      ) {
        col_pb = array_columnas_planta_alta;
      }
      if (
        array_columnas_planta_alta.length == 4 &&
        array_columnas_planta_baja.length == 4
      ) {
        col_pb = array_columnas_planta_alta;
      }

      if (
        array_columnas_planta_alta.length == 5 &&
        array_columnas_planta_baja.length == 4
      ) {
        for (
          let index = 1;
          index <= array_columnas_planta_baja.length;
          index++
        ) {
          if (index == 1) {
            col_pb.push(mayor - 2);
          }
          if (index == 2) {
            col_pb.push(mayor - 1);
          }
          if (index == 3) {
            col_pb.push('x');
          }
          if (index == 4) {
            col_pb.push(mayor);
          }
        }
      }
      if (
        array_columnas_planta_alta.length == 4 &&
        array_columnas_planta_baja.length == 5
      ) {
        for (
          let index = 1;
          index <= array_columnas_planta_baja.length;
          index++
        ) {
          if (index == 1) {
            col_pb.push(mayor - 3);
          }
          if (index == 2) {
            col_pb.push(mayor - 2);
          }
          if (index == 3) {
            col_pb.push('x');
          }
          if (index == 4) {
            col_pb.push(mayor);
          }
          if (index == 5) {
            col_pb.push(mayor - 1);
          }
        }
      }
      console.log('cooollllll', col_pb);

      let nro = 0;
      for (let j = 0; j < col_pb.length; j++) {
        let seats = [];
        for (let i = 1; i <= filas_planta_baja; i++) {
          if (j == 2) {
            seats.push({
              object: 'pasillo',
              status: 'pasillo',
              nro_seat: '',
            });
          } else {
            if (pandemia_mode) {
              if (col_pb.length == 4) {
                if (j == 1) {
                  nro = col_pb.length == 4 ? col_pb[j] + 3 : col_pb[j] + 4;

                  seats.push({
                    object: 'asiento',
                    status: 'ocupado',
                    nro_seat: nro.toString(),
                  });
                  ocupados += 1;
                } else {
                  nro = col_pb.length == 4 ? col_pb[j] + 3 : col_pb[j] + 4;

                  seats.push({
                    object: 'asiento',
                    status: vendidos.includes(nro) ? 'ocupado' : 'disponible',
                    nro_seat: nro.toString(),
                  });
                }
              } else {
                if (j == 1 || j == 3) {
                  nro = col_pb.length == 4 ? col_pb[j] + 3 : col_pb[j] + 4;

                  seats.push({
                    object: 'asiento',
                    status: 'ocupado',
                    nro_seat: nro.toString(),
                  });
                  ocupados += 1;
                } else {
                  nro = col_pb.length == 4 ? col_pb[j] + 3 : col_pb[j] + 4;

                  seats.push({
                    object: 'asiento',
                    status: vendidos.includes(nro) ? 'ocupado' : 'disponible',
                    nro_seat: nro.toString(),
                  });
                }
              }
            }else {
              nro = col_pb.length == 4 ? col_pb[j] + 3 : col_pb[j] + 4;

              seats.push({
                object: 'asiento',
                status: vendidos.includes(nro) ? 'ocupado' : 'disponible',
                nro_seat: nro.toString(),
              });
            }
          }
          col_pb[j] = nro;
        }
        planta_baja.push(seats);
      }
    }
    const data: PlanillaInfo = {
      trip:trip.idTrip,
      price_online: trip.price_online,
      type_bus: trip.bus.type_bus,
      departure_time: trip.departure_time,
      departure_date: trip.departure_date,
      terminal_origin: trip.origin.terminal,
      terminal_destination: trip.destination.terminal,
      carril: trip.carril,
      ocupados:ocupados,
      planta_alta,
      planta_baja,
    };
    console.log('laaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',planta_alta);

    return data;
  }












/**
 * 
 */
  async getAllInformacion(){
    // const bus = await this._busRepository
    //   .createQueryBuilder('trip')
    //   .leftJoinAndSelect('bus.trip', 'trip')
    //   .where('trip.idTrip = :trip', { trip: uid })
    //   .getOne();
    const trip = await getConnection()
      .getRepository(Trip)
      .createQueryBuilder('trip')
      .leftJoinAndSelect('trip.bus', 'bus')
      .leftJoinAndSelect('trip.origin', 'origin')
      .leftJoinAndSelect('trip.destination', 'destination')
      .getMany();

    // const tickets = await getConnection()
    //   .getRepository(Ticket)
    //   .createQueryBuilder('ticket')
    //   .where('ticket.trip = :id', { id: uid })
    //   .getMany();

    let vendidos = {};
    trip.forEach((item)=>{
      getConnection()
        .getRepository(Ticket)
        .createQueryBuilder('ticket')
        .where('ticket.trip = :id', { id: item.idTrip })
        .getMany()
        .then((tickets)=>{
          vendidos[`${item.idTrip}`] = tickets.map((e)=> e.nro_seat );
        });
    });

    let tipo_asiento_planta_alta;
    let tipo_asiento_planta_baja;
    let nro_asientos_planta_alta;
    let nro_asientos_planta_baja;
    let filas_planta_alta;
    let filas_planta_baja;
    let columnas_planta_alta;
    let columnas_planta_baja;
    let array_columnas_planta_alta;
    let array_columnas_planta_baja;
    let data : PlanillaInfo[] = [];
    for (let index = 0; index < trip.length; index++) {
      console.log('PAOLAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
      
      if (trip[index].bus.type_bus == 'PANORAMICO') {
        console.log('BRYANNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN');
        const panoramico = await this._busRepository
          .createQueryBuilder('bus')
          .leftJoinAndSelect('bus.bus_normal', 'normal')
          .where('bus.idBus = :id', { id: trip[index].bus.idBus })
          .getOne();
        tipo_asiento_planta_alta = panoramico.bus_normal.nro_rows == 4 ? 2 : 1;
        nro_asientos_planta_alta = panoramico.bus_normal.nro_seats;
        columnas_planta_alta = 2 + tipo_asiento_planta_alta;
        filas_planta_alta = nro_asientos_planta_alta / columnas_planta_alta;
        array_columnas_planta_alta =
          columnas_planta_alta == 4 ? [-3, -2, 'x', 0, -1] : [-3, -2, 'x', -1];
      }

      if (trip[index].bus.type_bus == 'PANORAMICO') {
        const panoramico = await this._busRepository
          .createQueryBuilder('bus')
          .leftJoinAndSelect('bus.bus_normal', 'normal')
          .where('bus.idBus = :id', { id: trip[index].bus.idBus })
          .getOne();
        tipo_asiento_planta_alta = panoramico.bus_normal.nro_rows == 4 ? 2 : 1;
        nro_asientos_planta_alta = panoramico.bus_normal.nro_seats;
        columnas_planta_alta = 2 + tipo_asiento_planta_alta;
        filas_planta_alta = nro_asientos_planta_alta / columnas_planta_alta;
        array_columnas_planta_alta =
          columnas_planta_alta == 4 ? [-3, -2, 'x', 0, -1] : [-3, -2, 'x', -1];
      }

      if (trip[index].bus.type_bus == 'DOBLE_PISO') {
        const doble = await this._busRepository
          .createQueryBuilder('bus')
          .leftJoinAndSelect('bus.bus_doble', 'doble')
          .where('bus.idBus = :id', { id: trip[index].bus.idBus })
          .getOne();
  
        tipo_asiento_planta_baja = doble.bus_doble.NF_P1 == 4 ? 2 : 1;
        tipo_asiento_planta_alta = doble.bus_doble.NF_P2 == 4 ? 2 : 1;
  
        nro_asientos_planta_baja = doble.bus_doble.NA_P1;
        columnas_planta_baja = 2 + tipo_asiento_planta_baja;
        filas_planta_baja = nro_asientos_planta_baja / columnas_planta_baja;
        array_columnas_planta_baja =
          columnas_planta_baja == 4 ? [-3, -2, 'x', 0, -1] : [-2, -1, 'x', 0];
  
        nro_asientos_planta_alta = doble.bus_doble.NA_P2;
        columnas_planta_alta = 2 + tipo_asiento_planta_alta;
        filas_planta_alta = nro_asientos_planta_alta / columnas_planta_alta;
        array_columnas_planta_alta =
          columnas_planta_alta == 4 ? [-3, -2, 'x', 0, -1] : [-2, -1, 'x', 0];
      }

      let filas_pa = 0;
      let filas_pb = 0;

      for (let index = 0; index < filas_planta_alta; index++) {
        let n = Math.abs(filas_planta_alta);
        let decimal = n - Math.floor(n);
        filas_pa += decimal;
      }

      for (let index = 0; index < filas_planta_baja; index++) {
        let n = Math.abs(filas_planta_alta);
        let decimal = n - Math.floor(n);
        filas_pb += decimal;
      }

        // Math.round();
    let planta_alta = [];
    let planta_baja = [];
    console.log('PADEMIAAAAAAAAAAAAA',trip[index].mode);
    
    let pandemia_mode = trip[index].mode == 'PANDEMIA' ? true : false;
    let ocupados = 0;
    /***
     * PLANTA ALTA
     */
    let mayor = 0;
    for (let j = 0; j < array_columnas_planta_alta.length; j++) {
      let seats = [];
      let nro = 0;

      for (let i = 1; i <= filas_planta_alta; i++) {
        if (j == 2) {
          seats.push({
            object: 'pasillo',
            status: 'pasillo',
            nro_seat: '',
          });
        } else {
          if (pandemia_mode) {
            if (array_columnas_planta_alta.length == 4) {
              if (j == 1) {
                nro =
                  array_columnas_planta_alta.length == 4
                    ? array_columnas_planta_alta[j] + 3
                    : array_columnas_planta_alta[j] + 4;
                seats.push({
                  object: 'asiento',
                  status: 'ocupado',
                  nro_seat: nro.toString(),
                });
                ocupados += 1;
              } else {
                nro =
                  array_columnas_planta_alta.length == 4
                    ? array_columnas_planta_alta[j] + 3
                    : array_columnas_planta_alta[j] + 4;
                seats.push({
                  object: 'asiento',
                  status: vendidos[trip[index].idTrip].includes(nro) ? 'ocupado' : 'disponible',
                  nro_seat: nro.toString(),
                });
              }
            } else {
              if (j == 1 || j == 3) {
                nro =
                  array_columnas_planta_alta.length == 4
                    ? array_columnas_planta_alta[j] + 3
                    : array_columnas_planta_alta[j] + 4;
                seats.push({
                  object: 'asiento',
                  status: 'ocupado',
                  nro_seat: nro.toString(),
                });
                ocupados += 1;
              } else {
                nro =
                  array_columnas_planta_alta.length == 4
                    ? array_columnas_planta_alta[j] + 3
                    : array_columnas_planta_alta[j] + 4;
                seats.push({
                  object: 'asiento',
                  status: vendidos[trip[index].idTrip].includes(nro) ? 'ocupado' : 'disponible',
                  nro_seat: nro.toString(),
                });
              }
            }
          }else {
            nro =
              array_columnas_planta_alta.length == 4
                ? array_columnas_planta_alta[j] + 3
                : array_columnas_planta_alta[j] + 4;
            seats.push({
              object: 'asiento',
              status: vendidos[trip[index].idTrip].includes(nro) ? 'ocupado' : 'disponible',
              nro_seat: nro.toString(),
            });
          }
        }
          array_columnas_planta_alta[j] = nro;
          if (nro > mayor) {
            mayor = nro;
          }
        }
        planta_alta.push(seats);
      }

        /***
     * PLANTA BAJA
     */
    if (trip[index].bus.type_bus == 'DOBLE_PISO') {
      /**
       * INICIO DE PLANTA BAJA
       */
      let col_pb = [];
      if (
        array_columnas_planta_alta.length == 5 &&
        array_columnas_planta_baja.length == 5
      ) {
        col_pb = array_columnas_planta_alta;
      }
      if (
        array_columnas_planta_alta.length == 4 &&
        array_columnas_planta_baja.length == 4
      ) {
        col_pb = array_columnas_planta_alta;
      }

      if (
        array_columnas_planta_alta.length == 5 &&
        array_columnas_planta_baja.length == 4
      ) {
        for (
          let index = 1;
          index <= array_columnas_planta_baja.length;
          index++
        ) {
          if (index == 1) {
            col_pb.push(mayor - 2);
          }
          if (index == 2) {
            col_pb.push(mayor - 1);
          }
          if (index == 3) {
            col_pb.push('x');
          }
          if (index == 4) {
            col_pb.push(mayor);
          }
        }
      }
      if (
        array_columnas_planta_alta.length == 4 &&
        array_columnas_planta_baja.length == 5
      ) {
        for (
          let index = 1;
          index <= array_columnas_planta_baja.length;
          index++
        ) {
          if (index == 1) {
            col_pb.push(mayor - 3);
          }
          if (index == 2) {
            col_pb.push(mayor - 2);
          }
          if (index == 3) {
            col_pb.push('x');
          }
          if (index == 4) {
            col_pb.push(mayor);
          }
          if (index == 5) {
            col_pb.push(mayor - 1);
          }
        }
      }
      console.log('cooollllll', col_pb);

      let nro = 0;
      for (let j = 0; j < col_pb.length; j++) {
        let seats = [];
        for (let i = 1; i <= filas_planta_baja; i++) {
          if (j == 2) {
            seats.push({
              object: 'pasillo',
              status: 'pasillo',
              nro_seat: '',
            });
          } else {
            if (pandemia_mode) {
              if (col_pb.length == 4) {
                if (j == 1) {
                  nro = col_pb.length == 4 ? col_pb[j] + 3 : col_pb[j] + 4;

                  seats.push({
                    object: 'asiento',
                    status: 'ocupado',
                    nro_seat: nro.toString(),
                  });
                  ocupados += 1;
                } else {
                  nro = col_pb.length == 4 ? col_pb[j] + 3 : col_pb[j] + 4;

                  seats.push({
                    object: 'asiento',
                    status: vendidos[trip[index].idTrip].includes(nro) ? 'ocupado' : 'disponible',
                    nro_seat: nro.toString(),
                  });
                }
              } else {
                if (j == 1 || j == 3) {
                  nro = col_pb.length == 4 ? col_pb[j] + 3 : col_pb[j] + 4;

                  seats.push({
                    object: 'asiento',
                    status: 'ocupado',
                    nro_seat: nro.toString(),
                  });
                  ocupados += 1;
                } else {
                  nro = col_pb.length == 4 ? col_pb[j] + 3 : col_pb[j] + 4;

                  seats.push({
                    object: 'asiento',
                    status: vendidos[trip[index].idTrip].includes(nro) ? 'ocupado' : 'disponible',
                    nro_seat: nro.toString(),
                  });
                }
              }
            }else {
              nro = col_pb.length == 4 ? col_pb[j] + 3 : col_pb[j] + 4;

              seats.push({
                object: 'asiento',
                status: vendidos[trip[index].idTrip].includes(nro) ? 'ocupado' : 'disponible',
                nro_seat: nro.toString(),
              });
            }
          }
            col_pb[j] = nro;
          }
          planta_baja.push(seats);
        }
      }
      const datas: PlanillaInfo = {
        trip:trip[index].idTrip,
        price_online: trip[index].price_online,
        type_bus: trip[index].bus.type_bus,
        departure_time: trip[index].departure_time,
        departure_date: trip[index].departure_date,
        terminal_origin: trip[index].origin.terminal,
        terminal_destination: trip[index].destination.terminal,
        carril: trip[index].carril,
        ocupados:ocupados,
        planta_alta,
        planta_baja,
      };

      data.push(datas);     
    }
  
    return data;
   

  

   

    


  

    
  
  }
}
