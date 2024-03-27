import { Test, TestingModule } from '@nestjs/testing';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';

describe('PublisherController', () => {
  let controller: PublisherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublisherController],
    })
      .useMocker((token) => {
        if (token === PublisherService) {
          return {
            findAll: jest.fn().mockResolvedValue({}),
          };
        }
      })
      .compile();

    controller = module.get<PublisherController>(PublisherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
