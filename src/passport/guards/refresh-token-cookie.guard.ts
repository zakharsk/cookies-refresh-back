import { CanActivate, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { refreshTokenCookieStrategyName } from '../../constants';

@Injectable()
export class RefreshTokenCookieGuard
  extends AuthGuard(refreshTokenCookieStrategyName)
  implements CanActivate {}
