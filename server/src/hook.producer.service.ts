import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
// import { Observable } from 'rxjs';
// import { filter, map, share } from 'rxjs/operators';
import { HookEntity } from './@types';

//INJECTIONING QUEUE
@Injectable()
export class HookProducerService {
  private logger = new Logger();
  constructor(@InjectQueue('hookQueue') private readonly queue: Queue) {}

  async addInQueue(hook: HookEntity) {
    try {
      await this.queue.add('new-hook', hook, { delay: 1000 });
    } catch (error) {
      this.logger.error(error);
    }
  }

  // onJobCompleted(): Observable<unknown> {
  //   return new Observable<unknown>((observer) => {
  //     this.queue.on('completed', (job: HookEntity) => {
  //       observer.next(job);
  //     });
  //   }).pipe(
  //     share(),
  //     filter((job: HookEntity) => job.name === 'sendEmail'),
  //     map((job) => job.data),
  //   );
  // }
}
