import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    Unique,
  } from 'typeorm';
import { TypeBooking } from './type_booking.enum';
import { BookingDetail } from './booking_detail.entity';
 
  @Entity('Booking')
  @Unique(['code'])
  export class Booking extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    idBooking: string;
    
    @Column({ type: 'varchar', length: 7, nullable: false })
    code: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    type_booking: TypeBooking;

    @OneToMany( type=>BookingDetail, bd=>bd.booking)
    booking_detail : BookingDetail[];

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
  