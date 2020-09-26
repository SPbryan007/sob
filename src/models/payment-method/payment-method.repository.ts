import { Repository, EntityRepository } from 'typeorm';
import { PaymentMethod } from './payment-method.entity';
import { CreatePaymentDto } from './dto/create.dto';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(PaymentMethod)
export class PaymentMethodRepository extends Repository<PaymentMethod> {
  async createNew(data: CreatePaymentDto): Promise<PaymentMethod> {
    const pm = new PaymentMethod();
    pm.name = data.name;
    pm.description = data.description;
    try {
      return await pm.save();
    } catch (error) {
      throw new InternalServerErrorException(
        `Something went wrong trying to save a new payment method`,
      );
    }
  }
}
