import { Module } from '@nestjs/common';
import { UserCustomerService } from './user-customer.service';
import { UserCustomerController } from './user-customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStaffRepository } from '../user-staff/user.repository';
import { RoleRepository } from '../role/role.repository';
import { AuthRepository } from '../auth/auth.repository';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserStaffRepository,
      RoleRepository,
      AuthRepository,
    ]),
    AuthModule,
    UtilsModule,
  ],
  providers: [UserCustomerService],
  controllers: [UserCustomerController],
})
export class UserCustomerModule {}
