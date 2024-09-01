import { CanActivate, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { authTokenHeaderStrategyName } from '../../constants';

@Injectable()
export class AuthTokenHeaderGuard
  extends AuthGuard(authTokenHeaderStrategyName)
  implements CanActivate {}
