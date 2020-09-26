import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  ParseIntPipe,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  Logger,
  Res,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { Company } from './com.entity';
import { CreateSimpleComDto, CreateNewComDto } from './dto/create-com.dto';
import { ValidationPipeGo } from 'src/shared/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { ReadSimpleComDto } from './dto/read-com.dto';

@Controller('company')
export class CompanyController {
  private logger = new Logger('CompanyController');
  constructor(private _companyService: CompanyService) {}
  /**
   * getAll
   */
  @Get('/')
  // @Roles('SPADMIN')
  //@UseGuards(AuthGuard(), RoleGuard)
  public async getSimpleCompanies(@Res() res): Promise<ReadSimpleComDto[]> {
    const com = await this._companyService.getSimpleCompanies();
    return res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Data Retrieved successfully',
      companies: com,
    });
  }
  /**
   * getById
   */
  @Get('/:uid')
  // @Roles('SPADMIN')
  //@UseGuards(AuthGuard(), RoleGuard)
  public async getSimpleComById(@Param('uid', ParseUUIDPipe) idCom: string) {
    return await this._companyService.getSimpleComById(idCom);
  }
  /**
   * Create new simple company
   */
  @Post('/create_simple')
  // @Roles('SPADMIN')
  @UsePipes(ValidationPipe)
  //@UseGuards(AuthGuard(), RoleGuard)
  public async createNewSimpleCom(
    @Body() createSimpleComDto: CreateSimpleComDto,
  ): Promise<ReadSimpleComDto> {
    return this._companyService.createNewSimpleCom(createSimpleComDto);
  }
  /**
   * createNewCompany
   */
  @Post('/register')
  @UsePipes(ValidationPipe)
  public async createNewCompany(
    @Body() createNewCom: CreateNewComDto,
    @Res() res,
  ): Promise<void> {
    await this._companyService.createNewCom(createNewCom);
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'company was registered successfully',
    });
  }
  /**
   * delete a company
   */

  @Delete('/delete/:id')
  // @Roles('SPADMIN')
  //@UseGuards(AuthGuard(), RoleGuard)
  public async deleteCom(
    @Param('id', ParseUUIDPipe) idCom: string,
    @Res() res,
  ): Promise<void> {
    await this._companyService.delete(idCom);
    return res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Company deteted successfully',
    });
  }

  /**
   * update a company
   */
  @Patch('/update/:id')
  // @Roles('SPADMIN')
  @UsePipes(ValidationPipe)
  //@UseGuards(AuthGuard(), RoleGuard)
  public updateCom(
    @Param('id', ParseUUIDPipe) idCom: string,
    @Body() data: Partial<CreateSimpleComDto>,
    @Res() res,
  ): void {
    res.status(HttpStatus.OK).json({
      status: 'OK',
      message: 'Company updated successfully',
    });
  }
}
