import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import {
  accessTokenCookieStrategyName,
  noAccessTokenCookieKey,
} from '@/constants';

@Injectable()
export class AccessTokenCookieGuard
  extends AuthGuard(accessTokenCookieStrategyName)
  implements CanActivate
{
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const noAccessTokenCookie = this.reflector.getAllAndOverride<boolean>(
      noAccessTokenCookieKey,
      [context.getHandler(), context.getClass()],
    );
    if (noAccessTokenCookie) {
      return true;
    }
    return super.canActivate(context);
  }
}
