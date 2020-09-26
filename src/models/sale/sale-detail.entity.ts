import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  Double,
  ManyToOne,
} from 'typeorm';
import { SaleType } from './saleType.enum';
import { Customer } from '../customer/customer.entity';
import { type } from 'os';
import { PaymentMethod } from '../payment-method/payment-method.entity';
import { Sale } from './sale.entity';
import { Ticket } from '../ticket/ticket.entity';

@Entity('sale_detail')
export class SaleDetail extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idSale: string;

  @Column({ type: 'int', default: 1, nullable: false })
  quantity: number;

  @Column({ type: 'double', nullable: false })
  sub_total: number;

  @ManyToOne(
    type => Sale,
    c => c.sale_detail,
  )
  sale: Sale;

  @ManyToOne(
    type => Ticket,
    t => t.sale_detail,
  )
  ticket: Ticket;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
