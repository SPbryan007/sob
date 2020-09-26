import { Expose, Exclude, Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateTripulationDto {
  @IsString()
  @IsNotEmpty()
  helper: string;
}
// @ValidateNested({ each: true })
//   @Type(() => CreatePersonDto)
//   person: CreatePersonDto;

//   @ValidateNested({ each: true })
//   @Type(() => AuthCredentialsStaffDto)
//   credentials: AuthCredentialsStaffDto;
