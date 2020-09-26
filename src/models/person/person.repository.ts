import { Repository, EntityRepository } from 'typeorm';
import { Person } from './person.entity';
import { CreatePersonDto } from './dto/create-person.dto';
import { ReadPersonDto } from './dto/read-person.dto';
import { plainToClass } from 'class-transformer';
import { ConflictException } from '@nestjs/common';

@EntityRepository(Person)
export class PersonRepository extends Repository<Person> {
  async createNewPerson(data: CreatePersonDto): Promise<Person> {
    const person = new Person();
    person.name = data.name;
    person.lastname = data.lastname;
    person.nationality = data.nationality;
    person.phone = data.phone;
    person.type_doc = data.type_doc;
    person.document = data.document;
    try {
      return await person.save();
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Document ${data.document} already exists`);
      }
    }
  }
}
