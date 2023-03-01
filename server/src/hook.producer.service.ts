import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { HookEntity } from './@types';

//INJECTIONING QUEUE
@Injectable()
export class HookProducerService {
  private logger = new Logger();
  constructor(@InjectQueue('hookQueue') private readonly queue: Queue) {}

  async tempName(hook: HookEntity) {
    try {
      await this.queue.add({
        text: 'dsada',
      });
    } catch (error) {
      this.logger.error(error);
    }
    // await this.queue.add('message-hook', hook);
  }
}
