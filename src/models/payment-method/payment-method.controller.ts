import {
  Controller,
  Get,
  Param,
  Post,
  Res,
  HttpStatus,
  Delete,
  Body,
  Query,
  Req,
  InternalServerErrorException,
  UseGuards,
} from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import { CurrentUser } from '../auth/CurrentUser.decorator';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { CreatePaymentDto } from './dto/create.dto';
import * as paypal from 'paypal-rest-sdk';
import { MakeSaleDto } from '../sale/dto/create.dto';
import { AppGateway } from 'src/app.gateway';
import { AuthGuard } from '@nestjs/passport';
import { BusModule } from 'src/models/bus/bus.module';

@Controller('payment')
export class PaymentMethodController {
  constructor(
    private _paymentMethodService: PaymentMethodService,
    private _getway: AppGateway
  ) {}
  @Get('/cancel')
  public async cancel_pay(@Req() req, @Res() res) {
    res.send('pay has been canceled');
   // console.log('holaaaaaa',this._BusModule.plantilla);
    
  }
  /**
   * async getById
   */
  @Get('/:id')
  public async getById(
    @Param('uid') uid: number,
    @CurrentUser() user: CurrentUserDto,
  ): Promise<any> {
    return await this._paymentMethodService.getById(uid);
  }
  /**
   * async
   */
  @Get('/')
  public async getAll(): Promise<any[]> {
    return await this._paymentMethodService.getAll();
  }
  /**
   * async createNew
   */
  @Post('/register')
  public async createNew(
    @Body() data: CreatePaymentDto,
    @Res() res,
  ): Promise<void> {
    await this._paymentMethodService.createNew(data);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Payment method registered successfully',
    });
  }
  /**
   * async delete
   */
  @Delete('/:id')
  public async delete(@Param('id') id: number, @Res() res): Promise<void> {
    await this._paymentMethodService.delete(id);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Payment method deleted successfully',
    });
  }
  /**
   * async payment
   */
  // @Post('/payment/success')
  // public async payment(@Query() query,@Res() res ) {
  //    await this._paymentMethodService.pay(query);
  //    res.status(HttpStatus.OK).json({
  //      status:'OK';
  //    })
  // }
  @Get('/success/:user/')
  public async success_pay(
    @Req() req,
    @Res() res,
    @Param('user') user: string,
  ) {
    const self = this._getway;
    
    let paymentId = req.query.paymentId; // recuperamos el id del pago
    let payerId = { payer_id: req.query.PayerID };// paypal
    console.log('aaaaaaaaaaaaaa', paymentId);
    console.log('aaaaaaaaaaaaaa', payerId);

    paypal.payment.execute(paymentId, payerId, async function (error, payment) {
      if (error) {
        console.error(error);
        throw new InternalServerErrorException(
          `Something went wrong trying to execute the payment`,
        );
      }
      if (payment.state == 'approved') {
        //*************************** */
        self.wss.to(self.users[user]).emit(
          'payment_process',
          JSON.stringify({
            status: 'PROCESSED',
          }),
        );
        res.send('please wait...');
      } else {
        res.send('payment not successfully');
      }
    });
  }
  /**
   * async cancel
   */
  @Get('/paypal/ok/:user/')
  async paymentok(@Param('user') user: string) {
    this._getway.wss.to(this._getway.users[user]).emit(
      'payment_process',
      JSON.stringify({
        status: 'PROCESSED',
      }),
    );
    // this._getway.wss.emit(
    //   'payment_process',
    //   JSON.stringify({
    //     status: 'PROCESSED',
    //   }),
    // );
    console.log('SE HA PROCESADO');
    return true;
  }
  /**
   * provider 
   */
  @Post('/paypal/pay')
  @UseGuards(AuthGuard()) 
  public async pay(
    @Body() data: MakeSaleDto,
    @Res() res,
    @CurrentUser() user: CurrentUserDto, 
  ): Promise<void> {
    console.log('ESTAMOS EN PAYPAL BLABLABLABLABLABLABALBALBALBALA');
    
    let items = [];
    let total = 0;
    data.ticket.forEach((item) => {
      let numb = item.price / 6.97;
      let price = numb.toFixed(2);
      items.push({
        name: 'Pasaje',
        sku: item.trip,
        price: price,
        currency: 'USD',
        quantity: 1,
      });
      total = total + parseFloat(price);
    });
    var create_payment_json = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `http://192.168.0.13:3000/api/payment/success/${user.email}/`,
        cancel_url: `http://192.168.0.13:3000/api/payment/cancel/${user.email}/`,
      },
      transactions: [
        {
          item_list: {
            items: items,
          },
          amount: {
            currency: 'USD',
            total: total.toString(),
          },
          description: 'Compra de pasaje trans bustillo',
        },
      ],
    };
    //*0
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let index = 0; index < payment.links.length; index++) {
          if (payment.links[index].rel === 'approval_url') {
            res.status(HttpStatus.OK).json({
              url: payment.links[index].href,
            });
          }
        }
      }
    });
  }
}
