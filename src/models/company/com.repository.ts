import { Repository, EntityRepository, getRepository } from 'typeorm';
import { Company } from './com.entity';
import { CreateSimpleComDto } from './dto/create-com.dto';
import {
  Logger,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { ReadComDto, ReadSimpleComDto } from './dto/read-com.dto';
import { plainToClass } from 'class-transformer';
import { Staff } from '../staff/staff.entity';
import { Person } from '../person/person.entity';

@EntityRepository(Company)
export class CompanyRepository extends Repository<Company> {
  private logger = new Logger('CompanyRespository');
  async createNewSimpleCom(
    data: CreateSimpleComDto,
  ): Promise<ReadSimpleComDto> {
    const com = new Company();
    com.name = data.name;
    com.nit = data.nit;
    com.city = data.city;
    com.country = data.country;
    com.address = data.address;
    try {
      const _saved = await com.save();
      this.logger.log(`Company created ${_saved}`);
      return plainToClass(ReadSimpleComDto, _saved);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Company already exists`);
      } else {
        throw new InternalServerErrorException(
          `Something went wrog trying to save a new company`,
          error,
        );
      }
    }
  }
}
