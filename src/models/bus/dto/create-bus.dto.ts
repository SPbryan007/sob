import { Expose, Exclude, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsIn,
  ValidateNested,
  IsOptional,
  IsInt,
  IsNumber,
} from 'class-validator';
import { TypeBus } from '../type-bus.enum';

export class CreateBusNormalDto {
  @IsString()
  @IsNotEmpty()
  plate_number: string;

  @IsNumber()
  @IsNotEmpty()
  nro_seats: number;

  @IsNumber()
  @IsNotEmpty()
  nro_rows: number;

  @IsIn([TypeBus.DOBLE_PISO, TypeBus.NORMAL])
  type_bus: TypeBus;
}

export class CreateBusDPDto {
  @IsString()
  @IsNotEmpty()
  plate_number: string;

  @IsNumber()
  @IsNotEmpty()
  NA_P1: number;

  @IsNumber()
  @IsNotEmpty()
  NA_P2: number;

  @IsNumber()
  @IsNotEmpty()
  NF_P1: number;

  @IsNumber()
  @IsNotEmpty()
  NF_P2: number;

  @IsIn([TypeBus.DOBLE_PISO, TypeBus.NORMAL])
  type_bus: TypeBus;
}
// export class CreateBusDto {
//   @IsString()
//   @IsNotEmpty()
//   plate_number: string;

//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => CreateBusDP)
//   bus_dp: CreateBusDP;

//   @IsOptional()
//   @ValidateNested({ each: true })
//   @Type(() => CreateBusNormal)
//   bus_normal: CreateBusNormal;
// }
