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
import { Person } from '../person/person.entity';
import * as moment from 'moment';
import { UserStaff } from '../user-staff/user.entity';

@Entity('Staff')
export class Staff extends BaseEntity {
  @PrimaryColumn()
  idStaff: string;

  @OneToOne(type => Person)
  @JoinColumn({ name: 'idStaff' })
  person: Person;

  @OneToOne(
    type => UserStaff,
    user => user.staff,
  )
  user: UserStaff;

  @ManyToOne(
    type => Company,
    com => com.staff,
  )
  company: Company;

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
