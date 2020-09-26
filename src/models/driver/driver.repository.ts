import { EntityRepository, Repository } from 'typeorm';
import { Driver } from './driver.entity';
import { Staff } from '../staff/staff.entity';
import { CreateDriverDto } from './dto/create-driver.dto';
import { ConflictException } from '@nestjs/common';

@EntityRepository(Driver)
export class DriverRepository extends Repository<Driver> {
  async createNewDriver(
    staff: Staff,
    _driver: CreateDriverDto,
  ): Promise<Driver> {
    const driver = new Driver();
    driver.idDriver = staff.idStaff;
    driver.nro_licence = _driver.nro_licence;
    driver.category = _driver.category;
    try {
      return await driver.save();
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`${staff} is already a driver`);
      }
    }
  }
}
