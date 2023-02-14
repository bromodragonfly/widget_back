import { Body, Controller, Get, Post, Query } from '@nestjs/common'; // Sse +
import { LoginUserDto } from './amo/dto';
import { AppService } from './app.service';
import { redirectActions } from './@types';
import { HookBodyDto } from './amo/dto/hook/hook-body.dto';
import { HookProducerService } from './hook.producer.service';

@Controller('gong')
export class AppController {
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
    this.appService.getLogin(subdomain, code);
    // const authCode = String(req.query.code);
  }

  @Post('login')
  postLogin(@Body() loginUserDto: LoginUserDto) {
    return this.appService.redirectReducer(redirectActions.LOGIN, loginUserDto);
  }

  @Get('delete')
  getDelete(@Query('account_id') account_id: string) {
    const accountId = Number(account_id);
    this.appService.getDelete(accountId);
    // return 'delete';
  }

  @Get('userstatus')
  getUserStatus(@Query('subdomain') subdomain: string) {
    return this.appService.getUserStatus(subdomain);
  }

  @Post('gong')
  async getHookGong(@Body() hookBodyDto: HookBodyDto) {
    /** Можно возвращать объект самого хука
     * далее передать его в очередь, и в очереди прописать EMITTER
     */
    const hook = this.appService.getHook(hookBodyDto);
    await this.hookProducer.tempName(hook);
  }

  // @Sse('connection')
  // sse(@OriginalUrl('subdomain') subdomain: string): Observable<MessagaEvent> {
  //   return this.appService.sseConnection(subdomain);
  // }
}
