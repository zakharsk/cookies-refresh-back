import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

import {
  accessTokenCookieName,
  accessTokenCookieStrategyName,
} from '@/constants';
import { UsersService } from '@/users/users.service';

function accessTokenExtractor(req: Request) {
  if (req && req.cookies[accessTokenCookieName]) {
    return req.cookies[accessTokenCookieName];
  }
}

@Injectable()
export class AccessTokenCookieStrategy extends PassportStrategy(
  Strategy,
  accessTokenCookieStrategyName,
) {
  constructor(
    readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: accessTokenExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('ACCESS_JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
