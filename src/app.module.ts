import { Module, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './models/user-staff/user.module';
import { CompanyModule } from './models/company/company.module';
import { BranchModule } from './models/branch/branch.module';
import { RoleModule } from './models/role/role.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusService } from './models/bus/bus.service';
import { ConfigService } from './config/config.service';
import { Configuration } from './config/config.keys';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ValidationPipeGo } from './shared/validation.pipe';
// import { HttpErrorFilter } from './shared/http-error.filter';
// import { LoggingInterceptor } from './shared/logging.interceptor';
import { AuthModule } from './models/auth/auth.module';
import { PersonModule } from './models/person/person.module';
import { StaffModule } from './models/staff/staff.module';
import { UtilsModule } from './utils/utils.module';
import { RouteModule } from './models/route/route.module';
import { TripModule } from './models/trip/trip.module';
import { BusModule } from './models/bus/bus.module';
import { TripulationModule } from './models/tripulation/tripulation.module';
import { DriverModule } from './models/driver/driver.module';
import { BookingModule } from './models/booking/booking.module';
import { SaleModule } from './models/sale/sale.module';
import { CustomerModule } from './models/customer/customer.module';
import { TicketModule } from './models/ticket/ticket.module';
import { PaymentMethodModule } from './models/payment-method/payment-method.module';
import { AppGateway } from './app.gateway';
import * as paypal from 'paypal-rest-sdk';
import { UserCustomerModule } from './models/user-customer/user-customer.module';
import { BusRepository } from './models/bus/busRepository';
// import { PlanillaInfo } from './models/bus/dto/bus-info.interface';

@Module({
  imports: [
    //TypeOrmModule.forFeature([BusRepository]),
    ConfigModule,
    DatabaseModule,
    UserModule,
    CompanyModule,
    BranchModule,
    RoleModule,
    AuthModule,
    PersonModule,
    StaffModule,
    UtilsModule,
    RouteModule,
    TripModule,
    BusModule,
    TripulationModule,
    DriverModule,
    BookingModule,
    SaleModule,
    CustomerModule,
    TicketModule,
    PaymentMethodModule,
    UserCustomerModule,
  ],
  controllers: [],
  // providers: [AppService],
  providers: [
    AppService,
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpErrorFilter,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
    // {
    //   provide: APP_PIPE,
    //   useClass: ValidationPipeGo,
    // },
  ],
})
export class AppModule {
  static port: number | string;
  //plantilla = {};
  constructor(private readonly _configService: ConfigService) {
    AppModule.port = this._configService.get(Configuration.PORT);
    paypal.configure({
      mode: 'sandbox', //sandbox or live
      client_id: this._configService
        .get(Configuration.CLIENT_ID_PAYPAL)
        .toString(),
      client_secret: this._configService
        .get(Configuration.CLIENT_SECRET_PAYPAL)
        .toString(),
    });
  }

  
}
