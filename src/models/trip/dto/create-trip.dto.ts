import { Expose, Exclude, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsIn,
  ValidateNested,
  IsDate,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { TravelStatus } from '../enum/travel-status.enum';
import { CreateTripulationDto } from 'src/models/tripulation/dto/create.dto';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  idBus: string;

  @IsString()
  @IsNotEmpty()
  idOrigin: string;

  @IsString()
  @IsNotEmpty()
  idDestination: string;

  @IsNotEmpty()
  @IsString()
  duration: string;

  @IsNotEmpty()
  @IsString()
  departure_date: string;

  @IsNotEmpty()
  @IsString()
  departure_time: string;

  @IsOptional()
  //@IsDate()
  arrival_date: string;

  @IsNotEmpty()
  @IsString()
  arrival_time: string;

  @IsOptional()
  //@IsNumber()
  min_price: number;

  @IsOptional()
  //@IsNumber()
  max_price: number;

  @IsNotEmpty()
  @IsNumber()
  price_online: number;

  @IsNotEmpty()
  @IsString()
  carril: string;

  @IsNotEmpty()
  @IsBoolean()
  mode: boolean;
}

export class SearchTripsDto {
  @IsNotEmpty()
  @IsString()
  origin: string;

  @IsNotEmpty()
  @IsString()
  destination: string;

  @IsNotEmpty()
  @IsString()
  departure_date: string;
}

// export class CreateRouteDto {
//   @IsString()
//   @IsNotEmpty()
//   departure_date: Date;

//   @IsString()
//   @IsNotEmpty()
//   departure_time: string;

//   @IsString()
//   @IsIn([
//     TravelStatus.CANCELED,
//     TravelStatus.FINISHED,
//     TravelStatus.IN_PROCESS,
//     TravelStatus.ON_HOLD,
//   ])
//   @IsNotEmpty()
//   status: TravelStatus;

//   @ValidateNested({ each: true })
//   @Type(() => CreateRouteDto)
//   route: CreateRouteDto;

//   @ValidateNested({ each: true })
//   @Type(() => CreateBusDto)
//   bus: CreateBusDto;

//   @ValidateNested({ each: true })
//   @Type(() => CreateBusDto)
//   : CreateBusDto;

//   @ValidateNested({ each: true })
//   @Type(() => CreateTripulationDto)
//   tripulation: CreateTripulationDto;
// }
