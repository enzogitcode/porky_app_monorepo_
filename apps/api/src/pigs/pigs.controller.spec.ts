import { Test, TestingModule } from '@nestjs/testing';
import { PigsController } from './pigs.controller';
import { PigsService } from './pigs.service';

describe('PigsController', () => {
  let controller: PigsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PigsController],
      providers: [PigsService],
    }).compile();

    controller = module.get<PigsController>(PigsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
