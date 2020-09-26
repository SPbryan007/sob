import { ValidateNested, IsNotEmpty, IsOptional } from 'class-validator';
import { Type, Exclude, Expose } from 'class-transformer';
import { ReadRouteDto } from 'src/models/route/dto/read-route.dto';
import { TypeBus } from 'src/models/bus/type-bus.enum';

@Exclude()
export class ReadSearchTripsDto {
  @Expose()
  id_trip: string;

  @IsOptional()
  @Expose()
  avaliable_seats: number;

  @Expose()
  bus: TypeBus;

  @Expose()
  duration: string;

  @Expose()
  departure_date: string;

  @Expose()
  departure_time: string;

  @Expose()
  arrilval_date: string;

  @Expose()
  arrival_time: string;

  @Expose()
  price_online: number;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ReadRouteDto)
  destination: ReadRouteDto;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => ReadRouteDto)
  origin: ReadRouteDto;
}
