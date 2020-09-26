import { Repository, EntityRepository, getConnection } from 'typeorm';
import { Tripulation } from './tripulation.entity';
import { CreateTripulationDto } from './dto/create.dto';
import { Driver } from '../driver/driver.entity';
import { ConflictException } from '@nestjs/common';

@EntityRepository(Tripulation)
export class TripulationRepository extends Repository<Tripulation> {
  async createNew(uuid: string, data: CreateTripulationDto) {
    const driver = await getConnection()
      .getRepository(Driver)
      .findOne(uuid);
    const tr = new Tripulation();
    tr.driver = driver;
    tr.helper = data.helper;

    try {
      const trip = await tr.save();
      return trip;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          `${driver} has already a tripulation assigned`,
        );
      }
    }
  }
}
