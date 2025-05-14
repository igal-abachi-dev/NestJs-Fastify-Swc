import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { z } from 'zod';
import { AppService } from './app.service';

const pwdSchema = z.object({ password: z.string().min(8) });
const fibBatchSchema = z.object({ ns: z.array(z.number().int().min(0)) });

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('joke')
  async getJoke() {
    return this.appService.fetchJoke();
  }
  
  @Get('fibonacci')
  async fib(@Query('n', ParseIntPipe) n: number) {
    const res = (await this.appService.calcFib(n)) as number;
    return { n, fibonacci: res };
  }

  @Post('fibonacci/batch')
  async fibBatch(@Body() body: unknown) {
    const parsed = fibBatchSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error);
    const fibs = (await this.appService.calcFibBatch(parsed.data.ns)) as number[];
    return { ns: parsed.data.ns, fibonacci: fibs };
  }

  @Post('hash-password')
  async hash(@Body() body: unknown) {
    const parsed = pwdSchema.safeParse(body);
    if (!parsed.success) throw new BadRequestException(parsed.error);
    return { hashed: await this.appService.hashPassword(parsed.data.password) };
  }

  @Post('compress-image')
  async compress(@Body('image') image: Buffer) {
    if (!Buffer.isBuffer(image)) throw new BadRequestException('image must be Buffer');
    return { compressed: await this.appService.compressImage(image) };
  }
}