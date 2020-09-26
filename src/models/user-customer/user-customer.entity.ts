import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignUpRO } from '../auth/dto/signup.dto';
import { Role } from '../role/role.entity';
import { StatusEmail } from './enum/status-email.enum';
import { UserStatus } from '../user-staff/user-status.enum';
import { SaleOnline } from '../sale/sale_online.entity';
import { BookingOnline } from '../booking/booking_online.entity';

@Entity('UserCustomer')
@Unique(['email'])
export class UserCustomer extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idUser: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', default: UserStatus.ACTIVE, length: 8 })
  status: UserStatus;

  @Column({ type: 'varchar', default: StatusEmail.VERIFIED, length: 10 })
  status_email: StatusEmail;

  @Column()
  salt: string;

  @OneToMany(
    type => SaleOnline,
    so => so.user,
  )
  sale_online: SaleOnline[];

  @OneToMany(
    type => BookingOnline,
    bo => bo.user_customer,
  )
  booking_online: BookingOnline[];

  // @Column({ type: 'varchar', length: 32 })
  // secret: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
}
