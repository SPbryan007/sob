import {  Module } from '@nestjs/common';
import { BusController } from './bus.controller';
import { BusService } from './bus.service';
import { BusRepository } from './busRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthRepository } from '../auth/auth.repository';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusRepository, AuthRepository]),
    AuthModule,
  ],
  controllers: [BusController],
  providers: [BusService],
})
export class BusModule {
  // plantilla = {};
  // constructor(
  //   @Inject(forwardRef(() => BusService))
  //   private _busService: BusService){
  //   this.getInformation();
  // }
 
  // async getInformation(){
  //   const info = await this._busService.getAllInformacion();
  //   info.forEach((item)=>{
  //     this.plantilla[`${item.trip}`] = item;
  //   })  
  // }
}
