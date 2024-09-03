import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import {
  AuthTokenHeaderStrategy,
  RefreshTokenCookieStrategy,
} from '../passport/strategies';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [TokensController],
  providers: [
    TokensService,
    AuthTokenHeaderStrategy,
    RefreshTokenCookieStrategy,
  ],
})
export class TokensModule {}
