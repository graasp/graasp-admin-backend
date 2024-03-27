import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppsModule } from '../src/app/apps.module';
import { AppsService } from '../src/app/apps.service';

describe('Apps', () => {
  let app: INestApplication;
  const appsService = { findAll: () => ['test'] };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppsModule],
    })
      .overrideProvider(AppsService)
      .useValue(appsService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET apps`, () => {
    return request(app.getHttpServer()).get('/cats').expect(200).expect({
      data: appsService.findAll(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
