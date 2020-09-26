import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { TravelStatus } from './enum/travel-status.enum';
import { Bus } from '../bus/bus.entity';
import { Route } from '../route/route.entity';
import { type } from 'os';
import { Ticket } from '../ticket/ticket.entity';

@Entity('trip')
export class Trip extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idTrip: string;

  @Column({ type: 'time', nullable: false })
  duration: string;

  @Column({ type: 'date', nullable: false })
  departure_date: string;

  @Column({ type: 'time', nullable: false })
  departure_time: string;

  @Column({ type: 'date', nullable: true })
  arrival_date: string;

  @Column({ type: 'time', nullable: false })
  arrival_time: string;

  @Column({ type: 'varchar', nullable: false, default: TravelStatus.ON_HOLD })
  status: TravelStatus;

  @Column({ type: 'double', nullable: false })
  min_price: number;

  @Column({ type: 'double', nullable: true })
  max_price: number;

  @Column({ type: 'double', nullable: true })
  price_online: number;

  @Column({ type: 'varchar', nullable: false })
  codigo_trip: string;

  @Column({ type: 'varchar', nullable: false })
  carril: string;

  @Column({ type: 'varchar', nullable: false })
  mode: string;

  @ManyToOne((type) => Route, (route) => route.trip_origin)
  origin: Route;

  @ManyToOne((type) => Route, (route) => route.trip_destination)
  destination: Route;

  @ManyToOne((type) => Bus, (bus) => bus.trip)
  bus: Bus;

  @OneToMany((type) => Ticket, (t) => t.trip)
  ticket: Ticket[];

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
