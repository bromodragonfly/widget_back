import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const OriginalUrl = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const url = request.originalUrl.split('=')[1];

    return url;
  },
);
