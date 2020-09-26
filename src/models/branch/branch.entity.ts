import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Company } from '../company/com.entity';
import { OfficeType } from './officetype.enum';
import { Staff } from '../staff/staff.entity';

@Entity('branch')
export class Branch extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idBran: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

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

  @Column({
    type: 'varchar',
    length: 15,
    nullable: false,
  })
  telephone: string;

  @ManyToOne(
    type => Company,
    com => com.branch,
  )
  company: Company;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
