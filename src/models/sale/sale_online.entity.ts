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

@Entity('sale_online')
export class SaleOnline extends BaseEntity {
  @PrimaryColumn()
  idOnline_sale: string;

  @OneToOne(type => Sale)
  @JoinColumn({ name: 'idOnline_sale' })
  sale: Sale;

  @ManyToOne(
    type => UserCustomer,
    uc => uc.sale_online,
    {
      nullable: true,
    },
  )
  user: UserCustomer;

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
