import { Expose, Exclude, Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { TypeBus } from '../type-bus.enum';

@Exclude()
export class ReadBusDto {
  @Expose()
  @IsNotEmpty()
  readonly idBus: string;

  @Expose()
  @IsNotEmpty()
  readonly plate_number: string;

  @Expose()
  @IsIn([TypeBus.DOBLE_PISO, TypeBus.NORMAL])
  type_bus: TypeBus;
}
