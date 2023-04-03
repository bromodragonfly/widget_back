import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SseController } from './sse.controller';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      maxListeners: Infinity,
    }),
  ],
  controllers: [SseController],
})
export class SseModule {}
