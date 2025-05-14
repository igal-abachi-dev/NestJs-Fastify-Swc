import { Injectable } from '@nestjs/common';
import { PinoLogger  } from 'nestjs-pino';
import Piscina from 'piscina';
import * as path from 'path';

@Injectable()
export class AppService {
  constructor(private readonly logger: PinoLogger ) {}

  /** Single, stateless pool (Actor style) */
  private readonly pool = new Piscina({
    filename: path.resolve(__dirname, 'worker.js'),
    maxThreads: 4,
  });

  // I/O-heavy example
  async fetchJoke(): Promise<any> {
    this.logger.info('Calling external joke API');
    const res = await fetch('https://official-joke-api.appspot.com/jokes/random');
    return res.json();
  }

  // ─────CPU heavy  API helpers ───────────────────────────────
  calcFib(n: number) {
    this.logger.debug(`Fib single ${n}`);
    return this.pool.run({ task: 'fibonacci', data: n });
  }
  calcFibBatch(arr: number[]) {
    this.logger.debug(`Fib batch len=${arr.length}`);
    return this.pool.run({ task: 'fibonacci', data: arr });
  }
  hashPassword(pwd: string) {
    return this.pool.run({ task: 'hashPassword', data: pwd });
  }
  compressImage(buf: Buffer) {
    // transfer underlying ArrayBuffer to avoid copy
    return this.pool.run(
      { task: 'compressImage', data: buf },
      { transferList: [buf.buffer] },
    );
  }
}