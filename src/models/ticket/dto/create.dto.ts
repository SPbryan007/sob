import {
  IsInt,
  IsNotEmpty,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Trip } from 'src/models/trip/trip.entity';
import { CreateTripDto } from 'src/models/trip/dto/create-trip.dto';
import { Type } from 'class-transformer';
import { Person } from 'src/models/person/person.entity';
import { CreatePersonDto } from 'src/models/person/dto/create-person.dto';

// export class CreateTicketDtoSimple {
//   @IsInt()
//   @IsNotEmpty()
//   nro_seat: number;

//   @ValidateNested({ each: true })
//   @Type(() => Trip)
//   trip: CreateTripDto;

//   @IsNumber()
//   @IsOptional()
//   price: number;

//   @ValidateNested({ each: true })
//   @Type(() => Person)
//   passenger: CreatePersonDto;
// }
export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  trip: string;

  @IsInt()
  @IsNotEmpty()
  nro_seat: number;

  @IsNumber()
  @IsOptional()
  price: number;

  @ValidateNested({ each: true })
  @Type(() => Person)
  passenger: CreatePersonDto;
}
