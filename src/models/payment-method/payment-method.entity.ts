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
import { Customer } from '../customer/customer.entity';
import { type } from 'os';
import { Sale } from '../sale/sale.entity';

@Entity('PaymentMethod')
export class PaymentMethod extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idPayment_method: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @OneToMany(
    type => Sale,
    sale => sale.payment_method,
  )
  sale: Sale[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
