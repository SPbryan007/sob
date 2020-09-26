import { Controller, Get, Param } from '@nestjs/common';
import { UserCustomerService } from './user-customer.service';
import { MailerService } from 'src/utils/mail.service';

@Controller('user-customer')
export class UserCustomerController {
  constructor(
    private _userService: UserCustomerService,
    private _mailer: MailerService,
  ) {}

  @Get('/')
  public async getOne(): Promise<any> {
    return true;
  }

  @Get('/:uid')
  public async get(@Param('uid') uid: string): Promise<any> {
    // let data = [{
    //     seat: 5,
    //     route: 'SUCRE - ORURO',
    //     code_trip: 'XXS-DF4'
    //     departure_date: '2020-07-10'
    //     departure_time: '23:00:00',
    //     code: 'DSS-859',
    //     carril: 2,
    //     passenger: 'Bryan Fernandez',
    //     document: i,
    //   }]
    //   const send = await this._mailer.sendMailTickets(data, uid);
    // console.log('se ha enviado un adjunto', send);
    // return true;
  }
}
