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
  Unique,
} from 'typeorm';
import { Trip } from '../trip/trip.entity';
import { Tripulation } from '../tripulation/tripulation.entity';
import { BusNormal } from './bus-normal.entity';
import { BusDp } from './Bus-doblepiso.entity';
import { TypeBus } from './type-bus.enum';
import { Driver } from '../driver/driver.entity';

@Entity('Bus')
@Unique(['plate_number'])
export class Bus extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idBus: string;

  @OneToOne((type) => BusNormal, (bn) => bn.Bus)
  bus_normal: BusNormal;

  @OneToOne((type) => BusDp, (bd) => bd.Bus)
  bus_doble: BusDp;

  @Column({ type: 'varchar', length: 20, nullable: false })
  type_bus: TypeBus;

  @Column({ type: 'varchar', length: 20, nullable: false })
  plate_number: string;

  @OneToOne((type) => Driver)
  @JoinColumn()
  driver: Driver;

  // @OneToOne((type) => Tripulation)
  // @JoinColumn()
  // tripulation: Tripulation;

  @OneToMany((type) => Trip, (trip) => trip.bus)
  trip: Trip[];

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
