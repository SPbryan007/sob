import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserStaffRepository } from './user.repository';
import { UserStaffService } from './user.service';
import { UserStaffController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import { RoleRepository } from '../role/role.repository';
import { AuthRepository } from '../auth/auth.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserStaffRepository,
      RoleRepository,
      AuthRepository,
    ]),
    AuthModule,
  ],
  providers: [UserStaffService],
  controllers: [UserStaffController],
})
export class UserModule {}
// import { Module } from '@nestjs/common';
// import { UserService } from './user.service';
// import { UserController } from './user.controller';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserRepository } from './user.repository';

// @Module({
//   imports: [TypeOrmModule.forFeature([UserRepository])],
//   providers: [UserService],
//   controllers: [UserController],
// })
// export class UserModule {}
