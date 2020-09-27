import { Repository, EntityRepository, getConnection } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create.dto';
import { Person } from '../person/person.entity';
import { PersonRepository } from '../person/person.repository';
import { CustomerType } from './customerType.enum';

@EntityRepository(Customer)
export class CustomerRepository extends Repository<Customer> {
  async createNew(
    data: CreateCustomerDto,
    email_user?: string,
  ): Promise<Customer> {
    console.log('.....DATA', data);

    let person = await getConnection()
      .getRepository(Person)
      .findOne({ where: { document: data.person.document } });
    if (!person) {
      person = await getConnection()
        .getCustomRepository(PersonRepository)
        .createNewPerson(data.person);

      const customer = new Customer();
      customer.email = email_user ? email_user : null;
      customer.phone = data.phone ? data.phone : null;
      customer.customer_type = CustomerType.PERSONA_NATURAL;
      customer.person = person;
      try {
        return await customer.save();
      } catch (error) {
        console.log('ERROR EN CUSTOMER SALVANDO...........', error);

        throw new InternalServerErrorException(
          `Something went wrong trying to save customer with ID: ${data.person.document}`,
        );
      }
    }
    return await this.findOne(person.idPerson);
    console.log('person', person);
  }
}
