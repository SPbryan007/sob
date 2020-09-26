import { Ticket } from './ticket.entity';
import { EntityRepository, Repository, getConnection } from 'typeorm';
import { CreateTicketDto } from './dto/create.dto';
import { Trip } from '../trip/trip.entity';
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

import { Person } from '../person/person.entity';
import { PersonRepository } from '../person/person.repository';

@EntityRepository(Ticket)
export class TicketRepository extends Repository<Ticket> {
  async createNew(data: CreateTicketDto[]): Promise<Ticket[]> {
    const trip = await getConnection()
      .getRepository(Trip)
      .findOne(data[0].trip);
    if (!trip) {
      throw new NotFoundException(
        `Trip with ID: ${data[0].trip} was not found `,
      );
    }
    let tickets = [];
    for (let index = 0; index < data.length; index++) {
      let person = await getConnection()
        .getRepository(Person)
        .findOne({ document: data[index].passenger.document });
      if (!person) {
        person = await getConnection()
          .getCustomRepository(PersonRepository)
          .createNewPerson(data[index].passenger);
      }
      console.log('Person...............',person);
      console.log('Trip...............',trip);
      
      const ticket = new Ticket();
      ticket.nro_seat = data[index].nro_seat;
      ticket.sale_price = data[index].price;
      ticket.trip = trip;
      ticket.code = rc.generate();
      ticket.passenger = person;

      console.log('PROBANDO SALVAR TICKETT.................................',ticket);
      

      try {
        tickets.push(await ticket.save());
      } catch (error) {
        console.log('HA OCURRIDO UN ERROR AL SALVAR EL TICKET................',error);
        throw new InternalServerErrorException(
          `Something went wrong trying to save a ticket`,
        );
       
        
      }
    }
    return tickets;

    // data.forEach(e => {
    //   const ticket = new Ticket();
    //   ticket.nro_seat = e.nro_seat;
    //   ticket.sale_price = e.price;
    //   ticket.trip = trip;
    //   ticket.passenger = person;
    //   tickets.push(ticket);
    // });

    // try {
    //   // const inserts = await this.save([...tickets]);
    //   // console.log('inserts',inserts);

    //   //inserts.identifi
    //   const inserts = await getConnection()
    //     .createQueryBuilder()
    //     .insert()
    //     .into(Ticket)
    //     .values(tickets)
    //     .returning('INSERTED.*') //or [] || INSERTED.*
    //     .printSql()
    //     .execute();

    //   return inserts[0].idTicket;
    // } catch (error) {
    //   throw new InternalServerErrorException(
    //     `Something went wrong trying to save a ticket`,
    //   );
    // }
  }
}
