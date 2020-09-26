import { Module } from '@nestjs/common';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';
import { SaleRepository } from './sale.repository';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketRepository } from '../ticket/ticket.repository';
import { AppGateway } from 'src/app.gateway';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SaleRepository, TicketRepository]),
    AuthModule,
    UtilsModule,
  ],
  providers: [SaleService, AppGateway],
  controllers: [SaleController],
})
export class SaleModule {}
