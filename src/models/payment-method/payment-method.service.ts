import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './payment-method.entity';
import { PaymentMethodRepository } from './payment-method.repository';
import { CreatePaymentDto } from './dto/create.dto';
import { AppGateway } from 'src/app.gateway';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private _paymentRepository: PaymentMethodRepository,

    private gateway: AppGateway,
  ) {}
  /**
   * async getById
   */
  public async getById(id: number): Promise<any> {
    return await this._paymentRepository.findOne(id);
  }
  /**
   * async getAll
   */
  public async getAll(): Promise<any[]> {
    return await this._paymentRepository.find();
  }
  /**
   * async createNew
   */
  public async createNew(data: CreatePaymentDto): Promise<void> {
    await this._paymentRepository.createNew(data);
  }
  /**
   * async delete
   */
  public async delete(id: number): Promise<void> {
    const payment = await this.getById(id);
    if (payment) {
      throw new NotFoundException(`Payment not found`);
    }
    await this._paymentRepository.delete(id);
  }
}
