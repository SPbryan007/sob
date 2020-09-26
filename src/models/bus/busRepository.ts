import { Repository, EntityRepository, getConnection } from 'typeorm';
import { Bus } from './bus.entity';
import { CreateBusNormalDto, CreateBusDPDto } from './dto/create-bus.dto';
import { BusNormal } from './bus-normal.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BusDp } from './Bus-doblepiso.entity';
import { Driver } from '../driver/driver.entity';
@EntityRepository(Bus)
export class BusRepository extends Repository<Bus> {
  async createBusNormal(data: CreateBusNormalDto, uid: string) {
    const driver = await getConnection().getRepository(Driver).findOne(uid);

    const bus = new Bus();
    bus.type_bus = data.type_bus;
    bus.plate_number = data.plate_number;
    bus.driver = driver;

    try {
      const saved = await bus.save();

      const bus_normal = new BusNormal();
      bus_normal.Bus = saved;
      bus_normal.nro_rows = data.nro_rows;
      bus_normal.nro_seats = data.nro_seats;
      await bus_normal.save();
      return true;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Bus or Driver already exists`);
      } else {
        throw new InternalServerErrorException(
          `Something went wrog trying to save a new Bus`,
          error,
        );
      }
    }
  }

  async createBusDP(data: CreateBusDPDto, uid: string): Promise<boolean> {
    const driver = await getConnection().getRepository(Driver).findOne(uid);

    const bus = new Bus();
    bus.type_bus = data.type_bus;
    bus.plate_number = data.plate_number;
    bus.driver = driver;

    try {
      console.log('oooo');

      const saved = await bus.save();
      console.log(saved);

      const bus_dp = new BusDp();
      bus_dp.Bus = saved;
      bus_dp.NA_P1 = data.NA_P1;
      bus_dp.NA_P2 = data.NA_P2;
      bus_dp.NF_P1 = data.NF_P1;
      bus_dp.NF_P2 = data.NF_P2;
      await bus_dp.save();
      return true;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Bus or Driver already exists`);
      } else {
        throw new InternalServerErrorException(
          `Something went wrog trying to save a new Bus`,
          error,
        );
      }
    }
  }
}
