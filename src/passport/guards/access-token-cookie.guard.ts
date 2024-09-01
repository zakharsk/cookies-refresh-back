import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  accessTokenCookieStrategyName,
  noAccessTokenCookieKey,
} from '../../constants';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

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
