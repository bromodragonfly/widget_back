import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('hookQueue')
export class HookConsumer {
  @Process('')
  messagehook(hook: Job<unknown>) {
    console.log(hook.data);
  }
}
