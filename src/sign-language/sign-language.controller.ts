import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { SignLanguageService } from './sign-language.service';

@Controller('sign-language')
export class SignLanguageController {
  constructor(private readonly signLanguageService: SignLanguageService) {}

  @Post('predict')
  async predict(@Body('frames') frames: number[]): Promise<{ prediction: number }> {
    if (frames.length !== 2520) {
      throw new BadRequestException('La entrada debe contener exactamente 2520 elementos.');
    }

    const predictionArray = await this.signLanguageService.predict(frames);
    const maxIndex = predictionArray.indexOf(Math.max(...predictionArray));

    return { prediction: maxIndex };
  }
}
