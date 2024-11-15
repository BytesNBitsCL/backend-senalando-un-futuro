import { Test, TestingModule } from '@nestjs/testing';
import { SignLanguageService } from './sign-language.service';

describe('SignLanguageService', () => {
  let service: SignLanguageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignLanguageService],
    }).compile();

    service = module.get<SignLanguageService>(SignLanguageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
