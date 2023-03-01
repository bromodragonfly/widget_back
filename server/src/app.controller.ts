import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Response,
  Sse,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { LoginUserDto } from './amo/dto';
import { AppService } from './app.service';
import { MessagaEvent, redirectActions } from './@types';
import { HookBodyDto } from './amo/dto/hook/hook-body.dto';
import { HookProducerService } from './hook.producer.service';
import { OriginalUrl } from './app.decorator';
import { interval, map, Observable } from 'rxjs';

@Controller('gong')
export class AppController {
  private logger = new Logger();
  constructor(
    private appService: AppService,
    private hookProducer: HookProducerService,
  ) {}

  @Get('ping')
  getPing() {
    return 'pong ' + Date.now();
  }

  @Get('login')
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
    /** Можно возвращать объект самого хука
     * далее передать его в очередь, и в очереди прописать EMITTER
     */
    const hook = await this.appService.getHook(hookBodyDto);
    if (hook) {
      this.hookProducer.tempName(hook);
    }
  }

  @Sse('connection')
  sse(@OriginalUrl('subdomain') subdomain: string): Observable<MessagaEvent> {
    // return this.appService.sseConnection(subdomain);
    return interval(5000).pipe(map(() => ({ data: 'ping ' })));
  }
}
