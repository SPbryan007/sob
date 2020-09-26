import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne, OneToMany
} from 'typeorm';
import { TypeDoc } from './typedoc.enum';
import { Ticket } from '../ticket/ticket.entity';
import { Staff } from '../staff/staff.entity';

@Entity('Person')
@Unique(['document'])
export class Person extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  idPerson: string;

  @Column({ type: 'varchar', length: 200, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  lastname: string;

  @Column({ type: 'varchar', length: 10, nullable: false })
  type_doc: TypeDoc;

  @Column({ type: 'varchar', length: 25, nullable: false })
  document: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 25, nullable: true })
  nationality: string;

  // @OneToOne((type) => Ticket, (passenger) => passenger.passenger) // specify inverse side as a second parameter
  // passenger: Ticket;

  @OneToMany((type) => Ticket, (passenger) => passenger.passenger) // specify inverse side as a second parameter
  passenger: Ticket[];


  @OneToOne((type) => Staff, (staff) => staff.person) // specify inverse side as a second parameter
  staff: Staff;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
