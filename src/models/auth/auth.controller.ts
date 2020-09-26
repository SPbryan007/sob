import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  UsePipes,
  Session,
  Param,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './CurrentUser.decorator';
import {
  AuthCredentialsStaffDto,
  AuthLoginCredentialsStaffDto,
  SignUpCredentialsCustomerDto,
  LoginCredentialsUserCustomerDto,
  ResetDataPasswordDto,
  VerificationCodeDto,
} from './dto/authCredentials.dto';
import { PayloadDto } from './dto/payload.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  /**
   * async signUpCustomer
   *
   */
  // @Post('/generate-pdf/:email')
  // public async generate_pdf(@Param('email') email: string) {
  //   return await this.authService.generate_pdf(email);
  // }
  @Post('/customer/signup')
  @UsePipes(ValidationPipe)
  public async signUpCustomer(
    @Body() signUpUserCustomerDto: SignUpCredentialsCustomerDto,
  ) {
    return await this.authService.signUpUserCustomer(signUpUserCustomerDto);
  }
  /**
   * async SendCode
   */
  @Post('/customer/signup/otp/:email')
  @UsePipes(ValidationPipe)
  public async SendCode(@Param('email') email: string, @Res() res) {
    const secret = await this.authService.SendCode(email);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      secret,
      message: 'sent code successfully!!!!',
    });
  }
  /**
   * Send code Reset Password
   */
  // awser.com/auth/
  @Post('/send-code-reset-password/:email')
  public async reset_password_send_code(
    @Param('email') email: string,
    @Res() res,
  ) {
    const secret = await this.authService.reset_password_send_code(email);
    res.status(HttpStatus.OK).json({
      secret: secret,
    });
  }

  /**
   * verification code reset pass
   */

  @Post('verification_code_pass')
  public async verification_code_pass(
    @Body() data: VerificationCodeDto,
    @Res() res,
  ) {
    await this.authService.VerificationCodePass(data);
    res.status(HttpStatus.OK).json({
      status: 'OK',
    });
  }
  /**
   * Reset Password
   */
  @Post('reset-password')
  public async reset_password(
    @Body() resetData: ResetDataPasswordDto,
    @Res() res,
  ) {
    await this.authService.reset_password(resetData);
    res.status(HttpStatus.OK).json({
      status: 'OK',
    });
  }

  // @Post('/signup')
  // async signUp(
  //   @Res() res,
  //   @Body(ValidationPipe) signUpDto: SignUpDto,
  // ): Promise<User> {
  //   const usersaved = await this.authService.signUp(signUpDto);
  //   return res.status(HttpStatus.OK).json({
  //     status: 'OK',
  //     message: 'User was create successfully',
  //     user: usersaved,
  //   });
  // }

  @Get('/customer/logout')
  @UseGuards(AuthGuard())
  async logout(@CurrentUser() user, @Req() req) {
    user = null;
    console.log(user);
    return true;
  }

  @Post('/customer/signin')
  async signIn(
    @Body(ValidationPipe) loginCredentials: LoginCredentialsUserCustomerDto,
  ): Promise<PayloadDto> {
    return this.authService.signInUserCustomer(loginCredentials);
  }

  @Post('/staff/signin')
  async signInStaff(
    @Body(ValidationPipe) authCredentials: AuthLoginCredentialsStaffDto,
  ): Promise<PayloadDto> {
    return this.authService.signInUserStaff(authCredentials);
  }
}
