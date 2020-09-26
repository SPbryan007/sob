import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { RouteRepository } from './route.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepository } from '../auth/auth.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RouteRepository, AuthRepository]),
    AuthModule,
  ],
  providers: [RouteService],
  controllers: [RouteController],
})
export class RouteModule {}
