import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-http-bearer';
import { TokensService } from '../../tokens/tokens.service';
import { UsersService } from '../../users/users.service';
import { authTokenHeaderStrategyName } from '../../constants';

@Injectable()
export class AuthTokenHeaderStrategy extends PassportStrategy(
  Strategy,
  authTokenHeaderStrategyName,
) {
  constructor(
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async validate(token: string) {
    const tokenData = this.tokensService.validateAuthToken(token);
    return this.usersService.logIn(tokenData);
  }
}
