import {
  IsString,
  MaxLength,
  IsIn,
  IsOptional,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { TypeDoc } from '../typedoc.enum';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastname: string;

  @IsIn([TypeDoc.CI, TypeDoc.NIT, TypeDoc.PASSPORT, TypeDoc.DNI])
  @IsString()
  @IsNotEmpty()
  type_doc: TypeDoc;

  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  document: string;

  @IsOptional()
  @IsString()
  @MaxLength(15)
  phone: string;

  @IsOptional()
  @IsString()
  @MaxLength(25)
  nationality: string;
}
