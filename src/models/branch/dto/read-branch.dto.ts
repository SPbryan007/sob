import { IsString, IsNumber } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReadSimpleBranchDto {
  //@Expose({ name:'identificador'}) a nivel de backend
  @Expose()
  @IsNumber()
  readonly idBran: string;

  @Expose()
  @IsString()
  readonly name: string;

  @Expose()
  @IsString()
  readonly phone: string;

  @Expose()
  @IsString()
  readonly address: string;

  @Expose()
  @IsString()
  readonly city: string;
}
