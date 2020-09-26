import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    OneToOne,
    JoinColumn,
    ManyToOne,
  } from 'typeorm';
import { type } from 'os';
import { Booking } from './booking.entity';
import { UserStaff } from '../user-staff/user.entity';
  
  @Entity('Booking_cash')
  export class BookingCash extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    idBooking_cash: string;
  
    @OneToOne(type=>Booking, { primary:true})
    @JoinColumn()
    booking: Booking;

    @ManyToOne(type=>UserStaff, user => user.booking_cash)
    user_staff : UserStaff;
  
    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
    updatedAt: Date;
  }
  
  // @ManyToMany(
  //   type => UserStaff,
  //   user => user.roles,
  // )
  // @JoinColumn()
  // users: UserStaff[];
  