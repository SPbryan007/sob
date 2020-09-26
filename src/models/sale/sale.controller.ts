import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Res,
  HttpStatus,
  Body,
  UsePipes,
  UseGuards,
  ValidationPipe,
  Query,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { SaleService } from './sale.service';
import { CurrentUser } from '../auth/CurrentUser.decorator';
import { MakeSaleDto } from './dto/create.dto';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { Roles } from '../role/decorators/role.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleType } from '../role/roletype.enum';
import { RoleGuard } from '../role/guards/role.guard';
import * as paypal from 'paypal-rest-sdk';

@Controller('sale')
export class SaleController {
  constructor(private _saleService: SaleService) {}
  @Get('/test')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  async hola(@Res() res, @CurrentUser() user: CurrentUserDto) {
    return 'sd';
  }
  /**
   * async getById
   */
  @Get('/:id')
  public async getById(@Param('uid') uid: number): Promise<any> {
    return await this._saleService.getById(uid);
  }
  /**
   * async
   */
  @Get('/')
  public async getAll(): Promise<any[]> {
    return await this._saleService.getAll();
  }
  /**
   * async createNew
   */
  @Post('/cash/register')
  @Roles(RoleType.MANAGEMENT, RoleType.ADMIN)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard(), RoleGuard)
  public async createNewSaleCash(
    @Body() data: MakeSaleDto,
    @Res() res,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<void> {
    const details = await this._saleService.createNewSaleCash(data, user);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'New Sale registered successfully',
      details,
    });
  }
  /**
   * async createNew
   */
  @Post('/online/saletouser')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())//intercepta la cabecera
  public async createNewSaleOnlineToUser(
    @Body() data: MakeSaleDto,
    @Res() res,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<void> {
    const ticket = await this._saleService.createNewSaleOnline(data, user);
    res.status(HttpStatus.OK).json(ticket);
  }
  /**
   *
   */
  @Post('/online/sale')
  @UsePipes(ValidationPipe)
  public async createNewSaleOnline(
    @Body() data: MakeSaleDto,
    @Res() res,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<void> {
    const details = await this._saleService.createNewSaleOnline(data, user);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'New Sale registered successfully',
      details,
    });
  }
  /**
   * async delete
   */
  // @Delete('/id')
  // public async delete(@Param('id') id: number, @Res() res): Promise<void> {
  //   await this._saleService.delete(id);
  //   res.status(HttpStatus.OK).json({
  //     status: 'OK',
  //     message: 'Sale deleted successfully',
  //   });
  // }
}
