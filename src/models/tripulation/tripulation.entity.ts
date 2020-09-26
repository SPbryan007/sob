import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Driver } from '../driver/driver.entity';
import { Bus } from '../bus/bus.entity';

@Entity('Tripulation')
export class Tripulation extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idTripulation: string;

  @OneToOne((type) => Driver)
  @JoinColumn()
  driver: Driver;

  @Column({ type: 'varchar', nullable: true })
  helper: string;

  // @OneToOne((type) => Bus, (bus) => bus.tripulation) // specify inverse side as a second parameter
  // bus: Bus;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updatedAt: Date;
}
