import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserStatus } from './user-status.enum';
import { Role } from '../role/role.entity';
import { Staff } from '../staff/staff.entity';
import { SaleCash } from '../sale/sale_cash.entity';
import { BookingCash } from '../booking/booking_cash.entity';

@Entity('UserStaff')
@Unique(['username'])
export class UserStaff extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idUser: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', default: UserStatus.ACTIVE, length: 8 })
  status: UserStatus;

  @OneToOne(
    type => Staff,
    staff => staff.user,
  )
  @JoinColumn()
  staff: Staff;

  @OneToMany(
    type => SaleCash,
    sc => sc.user,
  )
  sale_cash: SaleCash[];

  @OneToMany(
    type => BookingCash,
    bc => bc.user_staff,
  )
  booking_cash: BookingCash[];

  @Column()
  salt: string;

  @ManyToOne(
    type => Role,
    role => role.user,
  )
  role: Role;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}

// @ManyToMany(
//   type => Role,
//   role => role.users,
//   { eager: true }, //original true
// )
// @JoinTable({ name: 'user_roles' })
// roles: Role[];
