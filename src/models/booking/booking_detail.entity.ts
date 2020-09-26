import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  Double,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from './booking.entity';
import { Ticket } from '../ticket/ticket.entity';

@Entity('Booking_detail')
export class BookingDetail extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idBooking_detail: string;

  @Column({ type: 'double', nullable: false })
  subtotal: number;

  @ManyToOne(
    type => Booking,
    bd => bd.booking_detail,
  )
  booking: Booking;

  @ManyToOne(
    type => Ticket,
    t => t.booking_detail,
  )
  ticket: Ticket;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
