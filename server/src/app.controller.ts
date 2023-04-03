import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import { Request as Req, Response as Res } from 'express';
import { LoginUserDto } from './amo/dto';
import { AppService } from './app.service';
import { redirectActions } from './@types';
import { HookBodyDto } from './amo/dto/hook/hook-body.dto';
import { HookProducerService } from './hook.producer.service';

@Controller('gong')
export class AppController {
  private logger = new Logger('AppController');
  constructor(
    private appService: AppService,
    private hookProducer: HookProducerService,
  ) {}

  @Get('ping')
  getPing() {
    return 'pong ' + Date.now();
  }

  @Get('users')
  getUsers() {
    return this.appService.getDB();
  }

  @Get('login') //! onsave
  getLogin(@Query('code') code: string, @Query('referer') referer: string) {
    const subdomain = String(referer).split('.')[0];

    return this.appService.getLogin(subdomain, code);
  }

  @Post('login')
  postLogin(@Body() loginUserDto: LoginUserDto) {
    return this.appService.redirectReducer(redirectActions.LOGIN, loginUserDto);
  }

  @Get('delete')
  getDelete(@Query('account_id') account_id: string) {
    const accountId = Number(account_id);
    return this.appService.getDelete(accountId);
  }

  @Get('userstatus')
  async getUserStatus(
    @Query('subdomain') subdomain: string,
    @Response() res: Res,
  ) {
    const status = await this.appService.getUserStatus(subdomain);
    return res.set({ 'Access-Control-Allow-Origin': '*' }).send(status);
  }

  @Post('gong')
  async getHookGong(@Body() hookBodyDto: HookBodyDto) {
    const hook = await this.appService.getHook(hookBodyDto);
    if (hook) {
      return this.hookProducer.addInQueue(hook);
    }
  }
}
