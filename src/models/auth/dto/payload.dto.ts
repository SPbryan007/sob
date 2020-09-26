import { RoleType } from 'src/models/role/roletype.enum';
import { Company } from 'src/models/company/com.entity';

export class PayloadDto {
  idUser: string;
  email?: string;
  username?: string;
  company?: Company;
  role?: RoleType;
  token?: string;
  iat?: Date;
}
