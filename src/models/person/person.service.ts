import { Injectable, NotFoundException } from '@nestjs/common';
import { PersonRepository } from './person.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './person.entity';
import { ReadPersonDto } from './dto/read-person.dto';
import { plainToClass } from 'class-transformer';
import { CreatePersonDto } from './dto/create-person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private _personRepository: PersonRepository,
  ) {}

  /**
   * getAll people register on platform
   */
  public async getAll(): Promise<ReadPersonDto[]> {
    return plainToClass(ReadPersonDto, await this._personRepository.find());
  }

  /**
   * getById  method returns only one person
   */
  public async getById(idPerson: number): Promise<ReadPersonDto> {
    const person = await this._personRepository.findOne(idPerson);
    if (!person) {
      throw new NotFoundException(`Person with ID ${idPerson} does not exists`);
    }
    return plainToClass(ReadPersonDto, person);
  }
  /**
   * async create
person: CreatePersonDto   */
  public async createNewPerson(
    person: CreatePersonDto,
  ): Promise<ReadPersonDto> {
    return this._personRepository.createNewPerson(person);
  }
}
