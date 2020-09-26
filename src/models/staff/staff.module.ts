import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { StaffRepository } from './staff.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AuthRepository } from '../auth/auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaffRepository, AuthRepository]),
    AuthModule,
  ],
  providers: [StaffService],
  controllers: [StaffController],
})
export class StaffModule {}
