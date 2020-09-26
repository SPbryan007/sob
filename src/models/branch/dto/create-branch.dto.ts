import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateSimpleBranchDto {
  @MaxLength(50, { message: 'name too long' })
  @MinLength(5, { message: 'name too weak' })
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @MinLength(5, { message: 'name too weak' })
  @MaxLength(50, { message: 'name too long' })
  address: string;

  @IsNotEmpty()
  @MinLength(5, { message: 'name too weak' })
  @MaxLength(30, { message: 'name too long' })
  city: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'name too weak' })
  @MaxLength(14, { message: 'name too long' })
  phone: string;
}
