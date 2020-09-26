import { Module } from '@nestjs/common';
import { PersonService } from './person.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonRepository } from './person.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PersonRepository]), AuthModule],
  providers: [PersonService],
})
export class PersonModule {}
