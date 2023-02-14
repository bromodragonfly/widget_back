import { Module } from '@nestjs/common';
// import { AmoService } from './amo/amo.service';
// import { AmoModule } from './amo/amo.module';
// import { UserService } from './user/user.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { HookProducerService } from './hook.producer.service';
import { UserModule } from './user/user.module';
import { AmoModule } from './amo/amo.module';

@Module({
  imports: [
    AmoModule,
    HttpModule,
    UserModule,
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 4200,
      },
    }),
    BullModule.registerQueue({
      name: 'hookQueue',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, HookProducerService],
})
export class AppModule {}
