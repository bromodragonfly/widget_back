import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { HookProducerService } from './hook.producer.service';
import { UserModule } from './user/user.module';
import { AmoModule } from './amo/amo.module';
import { HookConsumer } from './hook.consumer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SseModule } from './sse/sse.module';
import { AmoApi } from './amo/amo';

@Module({
  imports: [
    HttpModule,
    UserModule,
    SseModule,
    BullModule.registerQueue({
      name: 'hookQueue',
      redis: {
        host: 'redis',
        port: 6379,
        maxRetriesPerRequest: null,
        connectTimeout: 180000,
      },
      defaultJobOptions: { removeOnComplete: true, removeOnFail: false },
      limiter: { max: 10000, duration: 1000, bounceBack: false },
    }),
    MongooseModule.forRoot('mongodb://mongo:27017/Gong', {
      maxPoolSize: 10,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, HookProducerService, HookConsumer, AmoApi],
})
export class AppModule {}
