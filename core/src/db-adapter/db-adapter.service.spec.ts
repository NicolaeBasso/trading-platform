import { Test, TestingModule } from '@nestjs/testing';
import { DbAdapterService } from './db-adapter.service';

describe('DbAdapterService', () => {
  let service: DbAdapterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DbAdapterService],
    }).compile();

    service = module.get<DbAdapterService>(DbAdapterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
