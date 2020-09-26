import { Repository, EntityRepository } from 'typeorm';
import { Booking } from './booking.entity';

@EntityRepository(Booking)
export class BookingRepository extends Repository<Booking> {}
