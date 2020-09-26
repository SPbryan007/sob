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
  PrimaryColumn,
} from 'typeorm';
import { Bus } from './bus.entity';

@Entity('Bus_normal')
export class BusNormal extends BaseEntity {
  @PrimaryColumn()
  idBus_normal: string;

  @OneToOne(type => Bus)
  @JoinColumn({ name: 'idBus_normal' })
  Bus: Bus;

  @Column({ type: 'int', nullable: false })
  nro_seats: number;

  @Column({ type: 'int', nullable: false })
  nro_rows: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
