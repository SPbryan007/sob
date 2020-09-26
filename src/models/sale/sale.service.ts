import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Sale } from './sale.entity';
import { SaleRepository } from './sale.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { MakeSaleDto } from './dto/create.dto';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { getConnection, getManager, TransactionRepository } from 'typeorm';
import { Ticket } from '../ticket/ticket.entity';
import { TicketRepository } from '../ticket/ticket.repository';
import { CustomerRepository } from '../customer/customer.repository';
import { PaymentMethod } from '../payment-method/payment-method.entity';
import { Customer } from '../customer/customer.entity';
import { Trip } from '../trip/trip.entity';
// import hola from '../../public/hola';
import * as ejs from 'ejs';
//import htmlPdf = require('html-pdf');
import * as htmlPdf from 'html-pdf';
//import * as htmlPdf from 'html-pdf-chrome';
import { MailerService } from 'src/utils/mail.service';

@Injectable()
export class SaleService {
  constructor(
    @InjectRepository(Sale)
    private _saleRepository: SaleRepository,

    @InjectRepository(Ticket)
    @TransactionRepository(Sale)
    private tickekRepository: TicketRepository,

    private _mailer: MailerService,
  ) {}

  /**
   * async getById
   */
  public async getById(id: number): Promise<any> {
    return await this._saleRepository.findOne(id);
  }
  /**
   * async getAll
   */
  public async getAll(): Promise<any[]> {
    return await this._saleRepository.find();
  }
  /**
   * async Cretae
   */
  public async createNewSaleCash(
    data: MakeSaleDto,
    user: CurrentUserDto,
  ): Promise<any[]> {
    const payment = await getConnection()
      .getRepository(PaymentMethod)
      .findOne({ where: { name: data.payment_method } });
    if (!payment) {
      throw new NotFoundException(
        `Payment Method ${data.payment_method} NOT FOUND`,
      );
    }
    let details = [];
    await getManager().transaction(async (transactionalEntityManager) => {
      const customer = await transactionalEntityManager
        .getCustomRepository(CustomerRepository)
        .createNew(data.customer);

      const tickets = await transactionalEntityManager
        .getCustomRepository(TicketRepository)
        .createNew(data.ticket);

      const sale = await transactionalEntityManager
        .getCustomRepository(SaleRepository)
        .createNewSaleCash(customer, payment, user);

      details = await transactionalEntityManager
        .getCustomRepository(SaleRepository)
        .createDetail(tickets, sale);
    });
    return details;
  }
  /**
   * async createNew
   */
  /**
   * async createNewSaleOnline
   */
  public async createNewSaleOnline(
    data: MakeSaleDto,
    user: CurrentUserDto,
  ): Promise<any> {
console.log('ESTOS SON LOS DATOS DEL TICKET..................',data);
console.log('ESTOS SON LOS DATOS DEL USUARIO..................',user);
data.ticket.map((e)=>{

})

    const payment = await getConnection()
      .getRepository(PaymentMethod)
      .findOne({ where: { name: data.payment_method } });
    if (!payment) {
      throw new NotFoundException(
        `Payment Method ${data.payment_method} NOT FOUND`,
      );
    }
    let results = [];
    let tickets : Ticket[] = [];
    // save
    let result: Trip;
    await getManager().transaction(async (transactionalEntityManager) => {
      const customer = await transactionalEntityManager
        .getCustomRepository(CustomerRepository)
        .createNew(data.customer);

      tickets = await transactionalEntityManager
        .getCustomRepository(TicketRepository)
        .createNew(data.ticket);

      const sale = await transactionalEntityManager
        .getCustomRepository(SaleRepository)
        .createNewSaleOnline(customer, payment, user);

      const details = await transactionalEntityManager
        .getCustomRepository(SaleRepository)
        .createDetail(tickets, sale);

      result = await getConnection()
        .getRepository(Trip)
        .createQueryBuilder('trip')
        .leftJoinAndSelect('trip.origin', 'origin')
        .leftJoinAndSelect('trip.destination', 'destination')
        .where('trip.idTrip = :id', { id: data.ticket[0].trip })
        .getOne();
    });
    console.log('11111111111111111111111111111111111111',data);

    // const query = await getConnection()
    //   .getRepository(Trip)
    //   .createQueryBuilder('trip')
    //   .leftJoinAndSelect('trip.origin', 'origin')
    //   .leftJoinAndSelect('trip.destination', 'destination')
    //   .leftJoinAndSelect('trip.ticket', 'ticket')
    //   .leftJoinAndSelect('ticket.passenger', 'passenger')
    //   .where('trip.idTrip = :id', { id: data.ticket[0].trip })
    //   .andWhere('ticket.idTicket = :id',{id:tickets[0].idTicket })
    //   .getMany();

      const ticketsData = await getConnection()
      .getRepository(Ticket)
      .createQueryBuilder('ticket')
      .innerJoinAndSelect('ticket.trip', 'trip')
      .innerJoinAndSelect('trip.origin', 'origin')
      .innerJoinAndSelect('trip.destination', 'destination')
      .innerJoinAndSelect('ticket.passenger', 'passenger')
      .where('ticket.idTrip = :id', { id: data.ticket[0].trip })
      .andWhere('ticket.idTicket = :uid',{uid:tickets[0].idTicket })
      .getMany();

    const datas = tickets.map((item)=>{
      return {
        seat: item.nro_seat,
        route: `${result.origin.city} - ${result.destination.city}`,
        code_trip: item.trip.codigo_trip,
        departure_date: item.trip.departure_date,
        departure_time: item.trip.departure_time,
        code: item.code,
        carril: item.trip.carril,
        passenger: `${item.passenger.name} - ${item.passenger.lastname}`,
        document: item.passenger.document,
      }
    })
    // data.ticket.forEach((item) => {
    //   query.andWhere('passenger.document = :doc', {
    //     doc: item.passenger.document,
    //   });
    // });
    const dataToSend = ticketsData.map((item)=>{
      return {
        seat: item.nro_seat,
        route: `${item.trip.origin.city} - ${item.trip.destination.city}`,
        code_trip: item.trip.codigo_trip,
        departure_date: item.trip.departure_date,
        departure_time: item.trip.departure_time,
        code: item.code,
        carril: item.trip.carril,
        passenger: `${item.passenger.name} - ${item.passenger.lastname}`,
        document: item.passenger.document,
      }
    });
    // const ticketstoSend = await query.getOne();
    
    // const ticketsDatas = ticketstoSend.ticket.map((item) => {
    //   let data = {
    //     seat: item.nro_seat,
    //     route: `${ticketstoSend.origin.city} - ${ticketstoSend.destination.city}`,
    //     code_trip: ticketstoSend.codigo_trip,
    //     departure_date: ticketstoSend.departure_date,
    //     departure_time: ticketstoSend.departure_time,
    //     code: item.code,
    //     carril: ticketstoSend.carril,
    //     passenger: `${item.passenger.name} - ${item.passenger.lastname}`,
    //     document: item.passenger.document,
    //   };
    //   return data;
    // });
    console.log('2222222222222222222222222222222222222222222',dataToSend);

    console.log('333333333333333333333333333333333333333333',ticketsData);

    console.log('4444444444444444444444444444444444444444444',datas);
    

    
    
   
    // const html = await ejs.renderFile('../../ticket.ejs', {
    //   ticket: ticketsData,
    // });
    // const options: htmlPdf.CreateOptions = {
    //   port: 9222, // port Chrome is listening on
    // };
    // const url = 'https://github.com/westy92/html-pdf-chrome';
    // console.log('3333333333333333333333333333333333333333334');
    // const pdf = await htmlPdf.create('<strong>Hola<strong>', options);
    // const file = pdf.toBuffer();
    // const file = new Promise((resolve, reject) => {
    //   htmlPdf.create('<strong>Hola</strong>').toBuffer((err, buffer) => {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       resolve(buffer);
    //     }
    //   });
    // });
    // console.log('44444444444444444444444444444444444444444444444');

    const send = await this._mailer.sendMailTickets(datas, user.email);
    console.log('se ha enviado un adjunto', send);

    const ticket = {
      codigo_trip: result.codigo_trip,
      route: `${result.origin.city} - ${result.destination.city}`,
    };

    return ticket;
  }

  /**
   * async delete
   */
  // public async delete(id: number): Promise<void> {
  //   const payment = await this.getById(id);
  //   if (payment) {
  //     throw new NotFoundException(`Payment not found`);
  //   }
  //   await this._paymentRepository.delete(id);
  // }
  /**
   * async
   */
}
