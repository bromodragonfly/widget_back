import { Controller, Get, Logger, Request, Response } from '@nestjs/common';
import { OriginalUrl } from 'src/app.decorator';
import { Request as Req, Response as Res } from 'express';
import { HookEntity } from 'src/@types';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';

@Controller('gong')
export class SseController {
  private logger = new Logger('SSE');
  notifyListener: (e: HookEntity) => void;

  @Get('connection')
  sse(
    @Response() res: Res,
    @OriginalUrl('subdomain') subdomain: string,
    @Request() req: Req,
  ) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Transfer-Encoding': 'chunked',
    });

    this.notifyListener = (e) => {
      if (subdomain === e.subdomain) {
        console.log(e);
        res.write(`data:${JSON.stringify(e)} \n\n`);
      }
    };

    res.write(`data:ping \n\n`);
    this.logger.debug('Connected to: ', subdomain);

    req.on('close', () => {
      EventEmitter2.prototype.removeAllListeners();
    });
  }

  @OnEvent('gong.created')
  OnEventHandler(message: HookEntity) {
    this.notifyListener(message);
  }
}
