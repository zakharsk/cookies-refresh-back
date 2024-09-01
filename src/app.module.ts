import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TokensModule } from './tokens/tokens.module';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenCookieGuard } from './passport/guards';
import { AccessTokenCookieStrategy } from './passport/strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    TokensModule,
    UsersModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AccessTokenCookieStrategy,
    {
      provide: APP_GUARD,
      useClass: AccessTokenCookieGuard,
    },
  ],
})
export class AppModule {}
