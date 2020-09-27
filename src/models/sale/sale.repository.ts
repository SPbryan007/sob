import { Repository, EntityRepository, getConnection } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Sale } from './sale.entity';
import { CreatePaymentDto } from '../payment-method/dto/create.dto';
import { PaymentMethod } from '../payment-method/payment-method.entity';
import { Customer } from '../customer/customer.entity';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';
import { SaleOnline } from './sale_online.entity';
import { UserStaff } from '../user-staff/user.entity';
import { SaleCash } from './sale_cash.entity';
import { SaleType } from './saleType.enum';
import { SaleDetail } from './sale-detail.entity';
import { Ticket } from '../ticket/ticket.entity';
import { UserCustomer } from '../user-customer/user-customer.entity';

@EntityRepository(Sale)
export class SaleRepository extends Repository<Sale> {
  async createNewSaleCash(
    customer: Customer,
    _payment: PaymentMethod,
    current: CurrentUserDto,
  ): Promise<Sale> {
    const user = await getConnection()
      .getRepository(UserStaff)
      .findOne(current.id);
    // const payment = await getConnection()
    //   .getRepository(PaymentMethod)
    //   .findOne({ where: { name: _payment } });
    const sale = new Sale();
    sale.payment_method = _payment;
    sale.customer = customer;
    sale.type_sale = SaleType.ON_CASH;

    try {
      const saved_sale = await sale.save();
      const sale_cash = new SaleCash();
      sale_cash.sale = saved_sale;
      sale_cash.user = user;
      const saved = await sale_cash.save();
      return saved_sale;
    } catch (error) {
      throw new InternalServerErrorException(
        `Something went wrong trying to save a new Sale cash`,
      );
    }
  }
  async createNewSaleOnline(
    customer: Customer,
    _payment: PaymentMethod,
    current: CurrentUserDto,
  ): Promise<Sale> {
    let user;
    console.log('OOOOOOOOOOOOOOOOOOOOOOOOOOOOOO', current);

    if (current) {
      user = await getConnection()
        .getRepository(UserCustomer)
        .findOne(current.id);
    }
    const sale = new Sale();
    sale.payment_method = _payment;
    sale.customer = customer;
    sale.type_sale = SaleType.ONLINE;
    console.log('HOLA MUNDO HOLA MUNOD....................', user);

    try {
      const saved_sale = await sale.save();
      const sale_online = new SaleOnline();
      sale_online.sale = saved_sale;
      sale_online.user = user; //current ? user : null;
      await sale_online.save();
      return saved_sale;
    } catch (error) {
      console.log('ERROR EN SALE REPOSITORY...', error);

      throw new InternalServerErrorException(
        `Something went wrong trying to save a new Sale cash`,
      );
    }
  }
  async createDetail(tickets: Ticket[], sale: Sale): Promise<SaleDetail[]> {
    let details = [];
    for (let index = 0; index < tickets.length; index++) {
      const detail = new SaleDetail();
      detail.ticket = tickets[index];
      detail.sale = sale;
      detail.sub_total = tickets[index].sale_price;
      details.push(await detail.save());
    }
    return details;
  }
}
