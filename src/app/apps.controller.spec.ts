import { Test, TestingModule } from '@nestjs/testing';
import { AppsController } from './apps.controller';
import { AppsService } from './apps.service';
import { v4 } from 'uuid';
import { IApp } from './interfaces/app.interface';

// const moduleMocker = new ModuleMocker(global);

const results: IApp[] = [
  {
    id: v4(),
    name: 'App 1',
    description: 'A description',
    url: 'http://localhost:3012',
    extra: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: v4(),
    name: 'App 2',
    description: 'Another description',
    url: 'http://localhost:3013',
    extra: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('AppsController', () => {
  let controller: AppsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppsController],
    })
      .useMocker((token) => {
        if (token === AppsService) {
          return {
            findAll: jest.fn().mockResolvedValue(results),
            findOne: jest
              .fn()
              .mockImplementation((id) => results.find((r) => r.id === id)),
          };
        }
        // if (typeof token === 'function') {
        //   const mockMetadata = moduleMocker.getMetadata(
        //     token,
        //   ) as MockFunctionMetadata<any, any>;
        //   const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        //   return new Mock();
        // }
      })
      .compile();

    controller = module.get<AppsController>(AppsController);
  });

  it('should return all apps', async () => {
    expect(await controller.findAll()).toBe(results);
  });
  it('should return one app', async () => {
    const app = results[0];
    const id = app.id;
    expect(await controller.findOne(id)).toBe(app);
  });
});
