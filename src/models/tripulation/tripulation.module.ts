import { Module } from '@nestjs/common';
import { TripulationService } from './tripulation.service';
import { TripulationController } from './tripulation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripulationRepository } from './tripulation.repository';
import { AuthRepository } from '../auth/auth.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TripulationRepository, AuthRepository]),
    AuthModule,
  ],
  providers: [TripulationService],
  controllers: [TripulationController],
})
export class TripulationModule {}
