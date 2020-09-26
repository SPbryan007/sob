import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Branch } from '../branch/branch.entity';
import { Staff } from '../staff/staff.entity';

@Entity('company')
@Unique(['nit'])
export class Company extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idCom: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  nit: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  country: string;

  @Column({
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  address: string;

  @Column({
    type: 'varchar',
    length: 40,
    nullable: false,
  })
  city: string;

  @OneToMany(
    type => Branch,
    branch => branch.company,
  )
  branch: Branch[];

  @OneToMany(
    type => Staff,
    staff => staff.company,
  )
  staff: Staff[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
