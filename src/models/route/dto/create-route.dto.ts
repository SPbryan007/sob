import { Expose, Exclude } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateRouteDto {
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  @IsString()
  terminal: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}

export class routes_filter {
  @IsOptional()
  query: string;
}
