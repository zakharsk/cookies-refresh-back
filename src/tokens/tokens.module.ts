import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { TokensController } from './tokens.controller';
import {
  AuthTokenHeaderStrategy,
  RefreshTokenCookieStrategy,
} from '../passport/strategies';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

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
