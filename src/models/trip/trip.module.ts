import { Module } from '@nestjs/common';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { TripRepository } from './trip.repository';
import { AuthRepository } from '../auth/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([TripRepository, AuthRepository]),
    AuthModule,
  ],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {
  
}
