import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    JoinColumn,
    OneToOne,
    ManyToOne,
  } from 'typeorm';
import { Booking } from './booking.entity';
import { UserCustomer } from '../user-customer/user-customer.entity';
  
  @Entity('Booking_online')
  export class BookingOnline extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    idBooking_online: string;
  
    @OneToOne(type=>Booking, { primary:true})
    @JoinColumn()
    booking: Booking;

    @ManyToOne(type=>UserCustomer, userc => userc.booking_online)
    user_customer : UserCustomer;

  
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
  