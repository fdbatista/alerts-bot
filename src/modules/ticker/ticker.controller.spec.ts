import { Test, TestingModule } from '@nestjs/testing';
import { TickerController } from './ticker.controller';
import { TickerService } from './ticker.service';
import { TickerRepository } from './ticker.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ticker } from 'src/database/entities/ticker';

const mockRepository = () => {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };
}

describe('TickerController', () => {
  let controller: TickerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Ticker),
          useValue: mockRepository(),
        },
        TickerService,
        TickerRepository
      ],
      controllers: [TickerController],
    }).compile();

    controller = module.get<TickerController>(TickerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
