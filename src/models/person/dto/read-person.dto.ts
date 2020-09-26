import { IsNumber, IsString, IsIn, IsDate } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';
import { TypeDoc } from '../typedoc.enum';

@Exclude()
export class ReadPersonDto {
  @Expose()
  @IsString()
  readonly idPerson: string;

  @Expose()
  @IsString()
  readonly name: string;

  @Expose()
  @IsString()
  readonly lastname: string;

  @Expose()
  @IsIn([TypeDoc.CI, TypeDoc.DNI, TypeDoc.NIT, TypeDoc.PASSPORT])
  readonly type_doc: TypeDoc;

  @Expose()
  @IsString()
  readonly document: string;

  @Expose()
  @IsString()
  readonly phone: string;

  @Expose()
  @IsString()
  readonly nationality: string;

  @Expose()
  @IsString()
  createdAt: Date;

  @Expose()
  @IsString()
  updatedAt: Date;
}
