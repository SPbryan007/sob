import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tripulation } from './tripulation.entity';
import { TripulationRepository } from './tripulation.repository';
import { CreateTripulationDto } from './dto/create.dto';
import { CurrentUserDto } from '../auth/dto/CurrentUser.dto';

@Injectable()
export class TripulationService {
  constructor(
    @InjectRepository(Tripulation)
    private _tripulationRepository: TripulationRepository,
  ) {}
  /**
   * async getAll
   */
  public async getAll(CurrentUser: CurrentUserDto) {
    return this._tripulationRepository.find();
  }
  /**
   * async getById
   */
  public async getById(currentUser: CurrentUserDto, uid: string) {
    return await this._tripulationRepository.findOne(uid);
  }
  /**
   * async create
   */
  public async createNewTripulation(
    uid: string,
    data: CreateTripulationDto,
  ): Promise<Tripulation> {
    return await this._tripulationRepository.createNew(uid, data);
  }
}
