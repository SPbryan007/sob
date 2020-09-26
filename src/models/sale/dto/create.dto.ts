import {
  IsString,
  IsNotEmpty,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { TypeDoc } from 'src/models/person/typedoc.enum';
import { Type } from 'class-transformer';
import { Person } from 'src/models/person/person.entity';
import { CreatePersonDto } from 'src/models/person/dto/create-person.dto';
import { Customer } from 'src/models/customer/customer.entity';
import { CreateCustomerDto } from 'src/models/customer/dto/create.dto';
import { CreateTicketDto } from 'src/models/ticket/dto/create.dto';

export class CreateSaleDto {
  @IsNotEmpty()
  @IsString()
  total_sale: number;
}
export class CreateSaleDetailDto {
  @IsString()
  @IsNotEmpty()
  id_trip: string;
}

export class MakeSaleDto {
  @ValidateNested({ each: true })
  @Type(() => Customer)
  customer: CreateCustomerDto;

  @ValidateNested({ each: true })
  @Type(() => Customer)
  ticket: CreateTicketDto[];

  @IsNotEmpty()
  @IsString()
  payment_method: string;
}
