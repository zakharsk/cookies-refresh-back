import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import {
  AuthTokenHeaderStrategy,
  RefreshTokenCookieStrategy,
} from '@/passport/strategies';
import { UsersModule } from '@/users/users.module';

import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';

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
