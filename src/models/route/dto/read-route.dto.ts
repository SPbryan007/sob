import { Expose, Exclude } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

@Exclude()
export class ReadRouteDto {
  @Expose()
  @IsString()
  @IsOptional()
  readonly idRoute: string;

  @Expose()
  @IsString()
  readonly city: string;

  @Expose()
  @IsString()
  readonly terminal: string;

  @Expose()
  @IsString()
  readonly address: string;
}


