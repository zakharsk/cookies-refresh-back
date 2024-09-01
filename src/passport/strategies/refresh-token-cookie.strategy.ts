import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import {
  refreshTokenCookieName,
  refreshTokenCookieStrategyName,
} from '../../constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

function refreshTokenExtractor(req: Request) {
  if (req && req.cookies[refreshTokenCookieName]) {
    return req.cookies[refreshTokenCookieName];
  }
}

@Injectable()
export class RefreshTokenCookieStrategy extends PassportStrategy(
  Strategy,
  refreshTokenCookieStrategyName,
) {
  constructor(
    readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: refreshTokenExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('REFRESH_JWT_SECRET'),
    });
  }
  async validate(payload: { sub: string }) {
    const user = await this.usersService.findOne(payload.sub);
    if (!user) throw new UnauthorizedException();

    return user;
  }
}
