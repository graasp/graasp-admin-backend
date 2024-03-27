import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppDto } from './dto/create-app.dto';
import { UpdateAppDto } from './dto/update-app.dto';
import { App } from './entities/app.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IApp } from './interfaces/app.interface';

@Injectable()
export class AppsService {
  constructor(
    @InjectRepository(App)
    private appRepository: Repository<App>,
  ) {}

  async create(createAppDto: CreateAppDto) {
    try {
      const app = await this.appRepository.save(createAppDto);
      return app;
    } catch (err) {
      if (err.driverError) {
        throw new BadRequestException(err.detail);
      }
    }
  }

  async findAll(): Promise<IApp[]> {
    const allApps = await this.appRepository.find({
      relations: { publisher: true },
    });
    return allApps;
  }

  async findOne(id: string) {
    // if app is not found will return empty array
    const [appEntity] = await this.appRepository.find({
      where: { id },
      relations: { publisher: true },
    });
    if (!appEntity) {
      throw new NotFoundException();
    }
    return appEntity;
  }

  async update(id: string, updateAppDto: UpdateAppDto) {
    try {
      await this.appRepository.update(id, updateAppDto);
      const savedUpdate = await this.appRepository.findOne({ where: { id } });
      return savedUpdate;
    } catch (err) {
      if (err.driverError) {
        throw new BadRequestException(err.detail);
      }
    }
  }

  async remove(id: string) {
    const appToDelete = await this.appRepository.findOne({ where: { id } });
    if (appToDelete) {
      await appToDelete.remove();
    } else {
      throw new BadRequestException(`No app with id ${id} found.`);
    }
    return appToDelete;
  }
}
