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
import { Sale } from './sale.entity';
import { UserCustomer } from '../user-customer/user-customer.entity';
import { UserStaff } from '../user-staff/user.entity';

@Entity('sale_cash')
export class SaleCash extends BaseEntity {
  @PrimaryColumn()
  idCash_sale: string;

  @OneToOne(type => Sale)
  @JoinColumn({ name: 'idCash_sale' })
  sale: Sale;

  @ManyToOne(
    type => UserStaff,
    uc => uc.sale_cash,
  )
  user: UserStaff;

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
