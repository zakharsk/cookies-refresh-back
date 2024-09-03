import { Controller, Delete, Get, Patch, Res, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

import { accessTokenCookieName, refreshTokenCookieName } from '@/constants';
import { CurrentUser, NoAccessTokenCookie } from '@/passport/decorators';
import { AuthTokenHeaderGuard } from '@/passport/guards';
import { RefreshTokenCookieGuard } from '@/passport/guards/refresh-token-cookie.guard';
import { User } from '@/users/entities/user.entity';
import { UsersService } from '@/users/users.service';

import { TokensService } from './tokens.service';

@Controller('tokens')
export class TokensController {
  constructor(
    private readonly tokensService: TokensService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async setNewTokens(user: User, res: Response, invalidate: boolean = false) {
    let accessTokenMaxAge = 0;
    let refreshTokenMaxAge = 0;
    let tokens = {
      accessToken: '',
      refreshToken: '',
    };

    if (!invalidate) {
      tokens = await this.tokensService.generateTokens(user.id);

      const accessTokenExpiresIn =
        this.jwtService.decode(tokens.accessToken).exp * 1000;
      const refreshTokenExpiresIn =
        this.jwtService.decode(tokens.refreshToken).exp * 1000;

      const currentTimestamp = Date.now();
      accessTokenMaxAge = accessTokenExpiresIn - currentTimestamp;
      refreshTokenMaxAge = refreshTokenExpiresIn - currentTimestamp;
    }

    res.cookie(accessTokenCookieName, tokens.accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: accessTokenMaxAge,
      sameSite: 'lax',
    });
    res.cookie(refreshTokenCookieName, tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: refreshTokenMaxAge,
      sameSite: 'lax',
    });

    if (invalidate) {
      await this.usersService.update(user.id, {
        refreshTokenHash: undefined,
      });
    } else {
      await this.usersService.updateRefreshTokenHash(
        user.id,
        tokens.refreshToken,
      );
    }
  }

  @NoAccessTokenCookie()
  @UseGuards(AuthTokenHeaderGuard)
  @Get()
  async logIn(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.setNewTokens(user, res);
  }

  @NoAccessTokenCookie()
  @UseGuards(RefreshTokenCookieGuard)
  @Patch()
  async refreshTokens(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.setNewTokens(user, res);
  }

  @Delete()
  async logOut(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.setNewTokens(user, res, true);
  }
}
