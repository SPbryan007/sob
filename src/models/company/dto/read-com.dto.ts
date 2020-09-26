import { IsString, MaxLength, IsNumber, IsIn, IsDate } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReadSimpleComDto {
  @Expose()
  @IsNumber()
  readonly idCom: string;

  @Expose()
  @IsString()
  readonly name: string;

  @Expose()
  @IsString()
  readonly nit: string;

  @Expose()
  @IsString()
  readonly address: string;

  @Expose()
  @IsString()
  readonly city: string;

  @Expose()
  @IsString()
  readonly country: string;

  @Expose()
  @IsDate()
  createdAt: Date;
}

export class ReadComDto {
  //@Expose({ name:'identificador'}) a nivel de backend
  @Expose()
  @IsNumber()
  readonly idCom: number;

  @Expose()
  @IsString()
  @MaxLength(50, { message: 'name too long' })
  readonly name: string;

  @Expose()
  @IsString()
  @MaxLength(25, { message: 'name too long' })
  readonly nit: string;

  @Expose()
  @IsString()
  @MaxLength(50, { message: 'description too long' })
  readonly address: string;

  @Expose()
  @IsString()
  @MaxLength(30, { message: 'description too long' })
  readonly city: string;
}
