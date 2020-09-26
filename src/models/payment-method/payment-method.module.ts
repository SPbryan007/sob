import { Module } from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { PaymentMethodController } from './payment-method.controller';
import { PaymentMethodRepository } from './payment-method.repository';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppGateway } from 'src/app.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethodRepository]), AuthModule],
  providers: [PaymentMethodService, AppGateway],
  controllers: [PaymentMethodController],
})
export class PaymentMethodModule {}
