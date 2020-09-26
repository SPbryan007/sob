import {
  Injectable,
  UnauthorizedException,
  Logger,
  Req,
  InternalServerErrorException,
  HttpStatus,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  AuthCredentialsUserDto,
  AuthCredentialsStaffDto,
  SignUpCredentialsStaffDto,
  AuthLoginCredentialsStaffDto,
  SignUpCredentialsCustomerDto,
  LoginCredentialsUserCustomerDto,
  VerificationCodeDto,
  ResetDataPasswordDto,
} from './dto/authCredentials.dto';
import { AuthRepository } from './auth.repository';
import { RoleType } from '../role/roletype.enum';
import { ReadSignUpStaffDto } from './dto/read-auth.dto';
import { PayloadDto } from './dto/payload.dto';
import { plainToClass } from 'class-transformer';
import { getConnection } from 'typeorm';
import { Company } from '../company/com.entity';
import { Staff } from '../staff/staff.entity';
import { UserStaff } from '../user-staff/user.entity';
import { MailerService } from 'src/utils/mail.service';
import * as Speakeasy from 'speakeasy';
import { UserCustomer } from '../user-customer/user-customer.entity';

// create the API client instance

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(AuthRepository)
    private _authRepository: AuthRepository,
    private jwtService: JwtService,
    private _mailer: MailerService,
  ) {}
  /**
   * async GenerateSecret
   */
  public async GenerateSecret() {
    const secret = Speakeasy.generateSecret({ length: 20 });
    return secret.base32;
  }
  /**
   * async
   */
  public async generateTokenValidation(_secret?: string) {
    let secret = _secret ? _secret : await this.GenerateSecret();
    return {
      token: await Speakeasy.totp({
        secret,
        encoding: 'base32',
        step: 30,
        window: 30,
      }),
      secret,
      //  remaining: 30 - Math.floor((new Date().getTime() / 1000.0) % 30),
    };
  }
  /**
   * async
   */
  public async ValidateCode(secret: string, token: string): Promise<boolean> {
    return await Speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: token,
      step: 30,
      window: 30,
    });
  }
  /**
   * async SendCode
   */
  public async SendCode(email: string): Promise<string> {
    const generated = await this.generateTokenValidation();
    const sent = await this._mailer.sendMailVericationCode(
      generated.token,
      email,
      'Su codigo de verificacion es / Your verification code is ',
    );
    if (!sent)
      throw new InternalServerErrorException('no se puedo enviar el email');
    return generated.secret;
  }
  /**
   * signup method for user customer
   */
  public async signUpUserCustomer(
    credentials: SignUpCredentialsCustomerDto,
  ): Promise<PayloadDto> {
    const validated = await this.ValidateCode(
      credentials.secret,
      credentials.token,
    );
    console.log('validated', validated);

    if (!validated) {
      throw new BadRequestException(`invalid token code`);
    }
    await this._authRepository.signUpUserCustomer(credentials);
    return await this.signInUserCustomer(
      plainToClass(LoginCredentialsUserCustomerDto, credentials),
    );
  }
  /**
   * Login UserCustomer
   */
  async signInUserCustomer(
    LoginCredentials: LoginCredentialsUserCustomerDto,
  ): Promise<PayloadDto> {
    const user = await this._authRepository.validateUserCustomerPassword(
      LoginCredentials,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    //token payload
    const payload: PayloadDto = {
      idUser: user.idUser,
      email: user.email,
    }; //pref
    const accessToken = {
      idUser: user.idUser,
      email: user.email,
      name: user.name,
      token: await this.jwtService.sign(payload),
    };
    this.logger.debug(
      `Genered  JWT token with payload ${JSON.stringify(payload)}`,
    );
    return plainToClass(PayloadDto, accessToken);
  }
  /**
   * signup for user staff
   */
  async signUpUserStaff(
    credentials: SignUpCredentialsStaffDto,
  ): Promise<ReadSignUpStaffDto> {
    return await this._authRepository.signUpUserStaff(credentials);
  }
  /**
   * signin for user staff
   */
  async signInUserStaff(
    authCredentialsStaff: AuthLoginCredentialsStaffDto,
  ): Promise<PayloadDto> {
    const user = await this._authRepository.validateUserStaffPassword(
      authCredentialsStaff,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    console.log('holaaaaa', user);

    const payload: PayloadDto = {
      idUser: user.idUser,
      username: user.username,
      company: user.staff.company,
      role: user.role.name as RoleType,
    };
    const accessToken = {
      idUser: user.idUser,
      username: user.username,
      company: user.staff.company,
      role: user.role.name as RoleType,
      token: await this.jwtService.sign(payload, { expiresIn: 3600 }),
    };
    this.logger.debug(
      `Genered  JWT token with payload ${JSON.stringify(payload)}`,
    );
    return plainToClass(PayloadDto, accessToken);
  }

  /**
   * generate_pdf
   */
  // public generate_pdf(email: string): boolean {
  //   // run the conversion and write the result to a file
  //   const self = this;
  //   // client.convertStringToFile(
  //   //   '<html><body><h1>Hello World!</h1></body></html>',
  //   //   './HelloWorld.pdf',
  //   //   function (err, fileName) {
  //   //     if (err) return console.error('Pdfcrowd Error: ' + err);
  //   //     console.log('Success: the file was created ' + fileName);
  //   //     const sent = self._mailer.sendPDF(email, fileName);
  //   //     if (!sent) throw new Error('MAL PDF......');
  //   //     console.log('todo bien');
  //   //   },
  //   // );

  //   let options = { format: 'A4' };
  //   let file = { content: '<h1>HELLOW</h1>' };

  //   html_to_pdf.generatePdf(file, options).then(async (pdfBuffer) => {
  //     const sent = await self._mailer.sendPDF(email, pdfBuffer);
  //     if (!sent) throw new Error('MAL PDF......');
  //     console.log('todo bien');
  //   });

  //   return true;
  // }

  /**
   * reset passwrod
   */
  public async reset_password_send_code(email: string): Promise<any> {
    const user = await getConnection()
      .getRepository(UserCustomer)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .getOne();

    if (!user) throw new NotFoundException('Email not found');

    const generated = await this.generateTokenValidation();
    const message =
      'Para restablecer tu contraseña, usa este código / To reset your password, use this code';
    const sent = await this._mailer.sendMailVericationCode(
      generated.token,
      user.email,
      message,
    );
    if (!sent)
      throw new InternalServerErrorException('no se puedo enviar el email');
    console.log(generated);

    return generated.secret;
  }

  public async VerificationCodePass(data: VerificationCodeDto): Promise<void> {
    const verified = await this.ValidateCode(data.secret, data.code);
    if (!verified) throw new BadRequestException('Invalid Code');
  }

  /**
   * Reset Passwod
   */
  public async reset_password(data: ResetDataPasswordDto): Promise<void> {
    const user = await getConnection()
      .getRepository(UserCustomer)
      .createQueryBuilder('user')
      .where('user.email = :email', { email: data.email })
      .getOne();
    await this._authRepository.updatePasswordUserCustomer(
      user.email,
      data.new_password,
    );
  }
}
