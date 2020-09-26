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
  OneToMany,
} from 'typeorm';
import { Person } from '../person/person.entity';
import { CustomerType } from './customerType.enum';
import { Sale } from '../sale/sale.entity';

@Entity('customer')
export class Customer extends BaseEntity {
  @PrimaryColumn()
  idCustomer: string;

  @Column({ type: 'varchar', length: 20 })
  customer_type: CustomerType;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @OneToOne(type => Person)
  @JoinColumn({ name: 'idCustomer' })
  person: Person;

  @OneToMany(
    type => Sale,
    sale => sale.customer,
  )
  sale: Sale[];

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
