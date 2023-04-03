import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Job } from 'bull';
import { HookEntity } from './@types';
import { AmoApi } from './amo/amo';
import { Gong } from './sse/order-created.event.ts/gongCreatedEvent';

@Processor('hookQueue')
export class HookConsumer {
  private logger = new Logger('Consumer');
  constructor(private eventEmitter: EventEmitter2) {}
  @Process('new-hook')
  async readOperationJob(hook: Job<HookEntity>) {
    if (hook) {
      try {
        const api = new AmoApi(hook.data.subdomain);
        const accData = await api.getDeal(hook.data.leadId);
        const gong = new Gong();
        gong.responsibleUser = accData.responsible_user_id;
        gong.leadPrice = accData.price;
        gong.leadName = accData.name;
        gong.audio = hook.data.audio;
        gong.leadId = hook.data.leadId;
        gong.picture = hook.data.picture;
        gong.subdomain = hook.data.subdomain;
        gong.text = hook.data.text;
        gong.users = hook.data.users;
        this.eventEmitter.emit('gong.created', this.prepareHook(gong));
      } catch (error) {
        this.logger.error(error);
      }
    }
  }

  prepareHook(entity: Gong) {
    const result = {
      text: entity.text,
      subdomain: entity.subdomain,
      responsibleUser: entity.responsibleUser,
      userPicture: String(entity.picture),
      users: entity.users,
      audio: entity.audio,
    };
    const priceHandrler = result.text.replace(
      '{{price}}',
      String(entity.leadPrice),
    )
      ? result.text.replace('{{price}}', String(entity.leadPrice))
      : result.text;

    const nameHandler = priceHandrler.replace('{{name}}', entity.leadName)
      ? priceHandrler.replace('{{name}}', entity.leadName)
      : result.text;

    if (nameHandler !== result.text) {
      result.text = nameHandler;
      return result;
    } else if (priceHandrler !== result.text) {
      result.text = priceHandrler;
      return result;
    } else result.text = result.text;

    return result;
  }
}
