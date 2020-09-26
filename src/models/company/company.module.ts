import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyRepository } from './com.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyRepository]), AuthModule],
  providers: [CompanyService],
  controllers: [CompanyController],
})
export class CompanyModule {}
