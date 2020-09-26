import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DriverRepository } from './driver.repository';
import { AuthRepository } from '../auth/auth.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DriverRepository, AuthRepository]),
    AuthModule,
  ],
  providers: [DriverService],
  controllers: [DriverController],
})
export class DriverModule {}
