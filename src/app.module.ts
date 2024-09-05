import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccessTokenCookieGuard } from './passport/guards';
import { AccessTokenCookieStrategy } from './passport/strategies';
import { PrismaModule } from './prisma/prisma.module';
import { TokensModule } from './tokens/tokens.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const nodeEnv = configService.get('NODE_ENV') || 'development';
        const isProduction = nodeEnv === 'production';
        return {
          pinoHttp: {
            level: isProduction ? 'warn' : 'debug',
            transport: {
              target: 'pino-pretty',
              options: {
                singleLine: isProduction,
              },
            },
          },
        };
      },
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
