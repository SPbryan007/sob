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
  OneToMany,
} from 'typeorm';
import { SaleType } from './saleType.enum';
import { Customer } from '../customer/customer.entity';
import { PaymentMethod } from '../payment-method/payment-method.entity';
import { SaleDetail } from './sale-detail.entity';

@Entity('sale')
export class Sale extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idSale: string;

  @Column({ type: 'double', nullable: false })
  total_sale: number;

  @Column({ type: 'varchar', length: 10, nullable: false })
  type_sale: SaleType;

  @ManyToOne(
    type => Customer,
    c => c.sale,
  )
  customer: Customer;

  @OneToMany(
    type => SaleDetail,
    c => c.sale,
  )
  sale_detail: SaleDetail[];

  @ManyToOne(
    type => PaymentMethod,
    pm => pm.sale,
  )
  payment_method: PaymentMethod;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
