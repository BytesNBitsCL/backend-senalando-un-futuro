import { Test, TestingModule } from '@nestjs/testing';
import { SignLanguageController } from './sign-language.controller';

describe('SignLanguageController', () => {
  let controller: SignLanguageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignLanguageController],
    }).compile();

    controller = module.get<SignLanguageController>(SignLanguageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
