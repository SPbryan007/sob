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

@Entity('Bus_dp')
export class BusDp extends BaseEntity {
  @PrimaryColumn()
  idBusdp: string;

  @OneToOne(type => Bus)
  @JoinColumn({ name: 'idBusdp' })
  Bus: Bus;

  @Column({ type: 'int', nullable: false })
  NA_P1: number;

  @Column({ type: 'int', nullable: false })
  NA_P2: number;

  @Column({ type: 'int', nullable: false })
  NF_P1: number;

  @Column({ type: 'int', nullable: false })
  NF_P2: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
