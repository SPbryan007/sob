import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  Double,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  OneToOne, PrimaryColumn
} from 'typeorm';
import { BookingDetail } from '../booking/booking_detail.entity';
import { Person } from '../person/person.entity';
import { Trip } from '../trip/trip.entity';
import { SaleDetail } from '../sale/sale-detail.entity';

@Entity('Ticket')
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idTicket: string;

  @PrimaryColumn()
  idPassenger : string;

  @PrimaryColumn()
  idTrip : string
  // @OneToOne((type) => Person)
  // @JoinColumn()
  // passenger: Person;

  @ManyToOne((type) => Person)
  @JoinColumn({name:'idPassenger'})
  passenger: Person;

  @ManyToOne((type) => Trip, (trip) => trip.ticket)
  @JoinColumn({name:'idTrip'})
  trip: Trip;
  // @ManyToOne((type) => Trip, (trip) => trip.ticket)
  // trip: Trip;

  @Column({ type: 'int', nullable: false })
  nro_seat: number;

  @Column({ type: 'varchar', nullable: false })
  code: string;

  @Column({ type: 'double', nullable: false })
  sale_price: number;

  @OneToMany((type) => BookingDetail, (bd) => bd.ticket)
  booking_detail: BookingDetail[];

  @OneToMany((type) => SaleDetail, (c) => c.ticket)
  sale_detail: SaleDetail[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
