import { AuthRepository } from './auth.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from 'src/config/config.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Configuration } from 'src/config/config.keys';
import { UserStaff } from '../user-staff/user.entity';
import { PayloadDto } from './dto/payload.dto';
import { plainToClass } from 'class-transformer';
import { RoleType } from '../role/roletype.enum';
import { getConnection } from 'typeorm';
import { UserStaffRepository } from '../user-staff/user.repository';
import { UserCustomer } from '../user-customer/user-customer.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configService: ConfigService,
    @InjectRepository(UserStaff)
    private readonly _userStaffRepository: UserStaffRepository, // @InjectRepository(UserCustomer) // private readonly _userCustomerRepository: UserCustomerRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get(Configuration.JWT_TOKEN),
    });
  }
  async validate(payload: PayloadDto): Promise<PayloadDto> {
    if (payload.username) {
      const staff = await this._userStaffRepository.findOne({
        username: payload.username,
      });
      if (!staff) throw new UnauthorizedException();
    }
    if (payload.email) {
      //
    }

    // if(roles.includes[RoleType.ADMIN]){

    // }
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // if (idCompany) {
    //   return plainToClass(PayloadDto, {
    //     id: payload.idUser,
    //     email: payload.email,
    //     idCompany: payload.idCompany,
    //     roles: payload.roles,
    //   });
    // }
    console.log(payload);

    return plainToClass(PayloadDto, payload);
    // return plainToClass(PayloadDto, {
    //   id: payload.idUser,
    //   email: payload.email,
    //   roles: payload.roles,
    // });
  }
}
