import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  ParseUUIDPipe,
  Res,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { UserStaffService } from './user.service';
// import { User, UserStaff } from './user.entity';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { ReadUserStaffDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import { ReadSignUpStaffDto } from '../auth/dto/read-auth.dto';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { CurrentUser } from '../auth/CurrentUser.decorator';
import { JwtAuthGuard } from '../auth/jw-auth.guard';
import { RoleType } from '../role/roletype.enum';
import { UserStatus } from './user-status.enum';

@Controller('userstaff')
export class UserStaffController {
  constructor(private readonly _userStaffService: UserStaffService) {}

  @Get('/:uid')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getUserById(
    @Param('uid', ParseUUIDPipe) uid: string,
  ): Promise<ReadUserStaffDto> {
    const user = await this._userStaffService.getById(uid);
    return user;
  }

  @Get('/')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async getAllUsers(
    @CurrentUser() user: CurrentUserDto,
  ): Promise<ReadUserStaffDto[]> {
    const users = await this._userStaffService.getAll(user);
    return users;
  }

  // @Patch(':id')
  // async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User) {
  //   const updatedUser = await this._userStaffService.update(id, user);
  //   return true;
  // }

  @Put('/setStatus/:uid')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  async setStatus(
    @Param('uid', ParseUUIDPipe) uid: string,
    @Body() status: UserStatus,
    @Res() res,
  ): Promise<void> {
    await this._userStaffService.setStatus(uid, status);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Status setted up successfully',
    });
  }

  // @Delete('/:uid')
  // @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  // @UseGuards(JwtAuthGuard, RoleGuard)
  // async deleteUser(
  //   @Param('uid', ParseUUIDPipe) uid: string,
  //   currentUser: CurrentUserDto,
  //   @Res() res,
  // ): Promise<void> {
  //   await this._userStaffService.delete(uid, currentUser);
  //   res.status(HttpStatus.OK).json({
  //     status: 'OK',
  //     message: 'User staff was deteleted successfully',
  //   });
  // }

  // @Post('setRole/:userId/:roleId')
  // async setRoleToUser(
  //   @Param('userId', ParseIntPipe) userId: number,
  //   @Param('roleId', ParseIntPipe) roleId: number,
  // ) {
  //   return this._userStaffService.setRoleToUser(userId, roleId);
  // }

  /**
   * async
   */
  public async() {}
}
