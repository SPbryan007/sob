import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Trip } from '../trip/trip.entity';

@Entity('route')
export class Route extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idRoute: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  city: string;

  @Column({ type: 'varchar', nullable: false })
  terminal: string;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @OneToMany((type) => Trip, (trip) => trip.origin)
  trip_origin: Trip[];

  @OneToMany((type) => Trip, (trip) => trip.destination)
  trip_destination: Trip[];

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
