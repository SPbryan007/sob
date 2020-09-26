// import {
//     BaseEntity,
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     CreateDateColumn,
//     UpdateDateColumn,
//     OneToMany,
//   } from 'typeorm';
//   import { Trip } from '../trip/trip.entity';

//   @Entity('route')
//   export class Route extends BaseEntity {
//     @PrimaryGeneratedColumn('uuid')
//     idRoute: string;

//     @Column({ type: 'varchar', length: 20, nullable: false })
//     origin: string;

//     @Column({ type: 'text', nullable: false })
//     destination: string;

//     @OneToMany(
//       type => Trip,
//       trip => trip.route,
//     )
//     trip: Trip[];

//     @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
//     createdAt: Date;

//     @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
//     updatedAt: Date;
//   }
