import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { HookEntity } from './@types';

@Injectable()
export class HookProducerService {
  constructor(@InjectQueue('hookQueue') private queue: Queue) {}

  async tempName(hook: Promise<void | HookEntity>) {
    await this.queue.add(hook);
  }
}
