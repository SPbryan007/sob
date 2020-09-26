import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Company } from '../company/com.entity';
import { UserStaff } from '../user-staff/user.entity';
import { category } from './category.enum';
import { Staff } from '../staff/staff.entity';
import { Bus } from '../bus/bus.entity';

@Entity('Driver')
export class Driver extends BaseEntity {
  @PrimaryColumn({ type: 'uuid' })
  idDriver: string;

  @OneToOne((type) => Staff)
  @JoinColumn({ name: 'idDriver' })
  staff: Staff;

  @Column({ type: 'varchar', nullable: false })
  nro_licence: string;

  @Column({ type: 'varchar', nullable: false })
  category: category;

  @OneToOne((type) => Bus, (bus) => bus.driver) // specify inverse side as a second parameter
  bus: Bus;

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
