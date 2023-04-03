import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AmoApi } from './amo/amo';
import { UserService } from './user/user.service';
import dayjs from 'dayjs';
import { getHookEntity } from './app.handler';

// TYPES AND DTO IMPORTS
import { DeleteUserDto, LoginUserDto } from './amo/dto';
import { redirectActions, newUser, HookEntity } from './@types';
import { HookBodyDto } from './amo/dto/hook/hook-body.dto';

@Injectable()
export class AppService {
  private readonly logger = new Logger();

  constructor(
    private readonly httpService: HttpService,
    private userServise: UserService,
  ) {}

  async getDB() {
    const users = await this.userServise.getAllUsers();
    return users;
  }

  async getLogin(subdomain: string, code: string) {
    const amoService = new AmoApi(subdomain, code);
    await amoService.getAccessToken();
    const isUserInDb = await this.userServise.findUserBySubdomain(subdomain);
    if (!isUserInDb) {
      const result = await amoService.getAccountData(); // TODO нужно описать приходящий объект
      const accId = Number(result.id);
      const newUser: newUser = {
        widgetUserSubdomain: subdomain,
        accountId: accId,
        paid: false,
        installed: true,
        testPeriod: true,
        startUsingDate: dayjs().format().slice(0, 10),
        finishUsingDate: dayjs().add(15, 'days').format().slice(0, 10),
      };
      return await this.userServise.createNewUser(newUser);
    }
    return await this.userServise.updateUser({
      subdomain: subdomain,
      installed: true,
    });
  }

  async getDelete(accountId: number) {
    const user = await this.userServise.findUserByAccountID(accountId);
    const subdomain = user.widgetUserSubdomain;

    return await this.userServise.updateUser({
      subdomain,
      installed: false,
    });
  }

  async redirectReducer(action: string, user: LoginUserDto | DeleteUserDto) {
    switch (action) {
      case redirectActions.DELETE:
        this.httpService.post('https://vds2151841.my-ihor.ru/informer', user);
        break;

      case redirectActions.LOGIN:
        this.httpService.post('https://vds2151841.my-ihor.ru/del', user);
        break;

      default:
        break;
    }
  }

  async getUserStatus(subdomain: string) {
    try {
      const user = await this.userServise.findUserBySubdomain(subdomain);

      const isSubscribe =
        new Date(user.finishUsingDate).getTime() -
        new Date(dayjs().format().slice(0, 10)).getTime();

      const returnedData = {
        paid: user.paid,
        testPeriod: user.testPeriod,
        startUsingDate: user.startUsingDate,
        finishUsingDate: user.finishUsingDate,
      };

      if (isSubscribe > 0) {
        if (user.testPeriod) {
          return JSON.stringify({
            ...returnedData,
            response: 'trial',
          });
        }
        return JSON.stringify({ ...returnedData, response: 'paid' });
      } else {
        this.userServise.updateUser({
          subdomain: subdomain,
          testPeriod: false,
          paid: false,
        });
        return JSON.stringify({ ...returnedData, response: 'notPaid' });
      }
    } catch (error) {
      this.logger.error(error);
      return JSON.stringify({
        response: 'userNotFound',
      });
    }
  }

  // TODO Прописать типы для реквеста
  async getHook(hook: HookBodyDto): Promise<HookEntity | void> {
    const hookEntity = getHookEntity(hook);

    this.logger.debug('Hook from subdomain:', hookEntity.subdomain);

    const user = await this.userServise.findUserBySubdomain(
      hookEntity.subdomain,
    );

    if (user.testPeriod || user.paid) {
      return hookEntity;
    }
    return this.logger.error('Нужно оплатить виджет', user);
  }
}
