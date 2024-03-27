import { Test, TestingModule } from '@nestjs/testing';
import { AppsService } from './apps.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { App } from './entities/app.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { BadRequestException, NotFoundException } from '@nestjs/common';

class DBError extends Error {
  driverError: Error;
  detail: string;
  constructor(message) {
    super(message);
    this.driverError = new Error('driver');
    this.detail = message;
  }
}

const results = [
  {
    id: v4(),
    name: 'App 1',
    key: v4(),
    description: 'A description',
    url: 'http://localhost:3012',
    extra: {},
    publisher: { id: v4() },
    createdAt: new Date(),
    updatedAt: new Date(),
  } as App,
  {
    id: v4(),
    name: 'App 2',
    key: v4(),
    description: 'Another description',
    url: 'http://localhost:3013',
    extra: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  } as App,
];
const createAppPayload = {
  name: 'App',
  description: 'description',
  url: 'http://localhost:3000',
  publisher: {
    id: v4(),
  },
};

describe('AppsService', () => {
  let service: AppsService;
  let appsRepository: Repository<App>;

  beforeEach(async () => {
    const appsRepositoryToken = getRepositoryToken(App);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppsService,
        { provide: appsRepositoryToken, useClass: Repository },
      ],
    }).compile();

    appsRepository = module.get<Repository<App>>(appsRepositoryToken);
    service = module.get<AppsService>(AppsService);
  });

  describe('Get all apps', () => {
    it('should return all apps including publishers', async () => {
      const mockedFunction = jest
        .spyOn(appsRepository, 'find')
        .mockResolvedValueOnce(Promise.resolve(results));
      expect(await service.findAll()).toBe(results);
      expect(mockedFunction).toHaveBeenCalledWith({
        relations: { publisher: true },
      });
    });
  });
  describe('Create apps', () => {
    it('should create an app', async () => {
      const mockedFunction = jest
        .spyOn(appsRepository, 'save')
        .mockResolvedValueOnce(Promise.resolve(results[0]));

      expect(await service.create(createAppPayload)).toBe(results[0]);
      expect(mockedFunction).toHaveBeenCalledWith(createAppPayload);
    });
    it('throws error on duplicate name', async () => {
      const message = 'name must be unique';
      const mockedFunction = jest
        .spyOn(appsRepository, 'save')
        .mockRejectedValue(new DBError(message));
      await expect(
        async () => await service.create(createAppPayload),
      ).rejects.toThrow(BadRequestException);
      expect(mockedFunction).toHaveBeenCalledWith(createAppPayload);
    });
    it('throws error on duplicate app key', async () => {
      const message = 'key must be unique';
      const mockedFunction = jest
        .spyOn(appsRepository, 'save')
        .mockRejectedValue(new DBError(message));
      await expect(
        async () => await service.create(createAppPayload),
      ).rejects.toThrow(BadRequestException);
      expect(mockedFunction).toHaveBeenCalledWith(createAppPayload);
    });
    it('throws error on duplicate url', async () => {
      const message = 'url must be unique';
      const mockedFunction = jest
        .spyOn(appsRepository, 'save')
        .mockRejectedValue(new DBError(message));
      await expect(
        async () => await service.create(createAppPayload),
      ).rejects.toThrow(BadRequestException);
      expect(mockedFunction).toHaveBeenCalledWith(createAppPayload);
    });
  });
  describe('Get one app', () => {
    it('Find one app', async () => {
      const id = results[0].id;
      const mockedFunction = jest
        .spyOn(appsRepository, 'find')
        .mockResolvedValue([results[0]]);
      expect(await service.findOne(id)).toBe(results[0]);
      expect(mockedFunction).toHaveBeenCalledWith({
        where: { id },
        relations: { publisher: true },
      });
    });
    it('No app found for id', async () => {
      const id = results[1].id;
      const mockedFunction = jest
        .spyOn(appsRepository, 'find')
        .mockResolvedValue([]);
      await expect(async () => await service.findOne(id)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockedFunction).toHaveBeenCalledWith({
        where: { id },
        relations: { publisher: true },
      });
    });
  });
});
