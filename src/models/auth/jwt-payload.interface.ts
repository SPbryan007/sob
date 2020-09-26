import { RoleType } from '../role/roletype.enum';

export interface IJwtPayloadCustomer {
  id: number;
  email: string;
  roles: RoleType[];
  token?: string;
  iat?: Date;
}
export interface IJwtPayloadAdmin {
  id: number;
  email: string;
  idCompany: number;
  roles: RoleType[];
  iat?: Date;
}
export interface IJwtPayloadSPadmin {
  id: number;
  email: string;
  roles: RoleType[];
  iat?: Date;
}
