import { IsString, MaxLength, IsNumber } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @MaxLength(20, { message: 'name too long' })
  readonly name: string;

  @IsString()
  @MaxLength(100, { message: 'description too long' })
  readonly description: string;
}
