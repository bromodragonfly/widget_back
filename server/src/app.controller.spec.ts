import { HttpService } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HookProducerService } from './hook.producer.service';
import { UserService } from './user/user.service';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(() => {
    service = new AppService(new HttpService(), UserService);
    controller = new AppController(AppService, HookProducerService);
    //     const app: TestingModule = await Test.createTestingModule({
    //       controllers: [AppController],
    //       providers: [AppService],
    //     })
    //       .overrideProvider(AppService)
    //       .useValue(MockAppService)
    //       .compile();

    //     controller = app.get<AppController>(AppController);
    //   });
  });

  describe('test', () => {
    it('sdskapdas', async () => {});
  });
});
