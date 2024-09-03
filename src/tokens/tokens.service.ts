import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class TokensService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  validateAuthToken(token: string) {
    try {
      const jsonString = atob(token);
      const jsonObj: CreateUserDto = JSON.parse(jsonString);
      jsonObj.login = decodeURIComponent(jsonObj.login);
      jsonObj.password = decodeURIComponent(jsonObj.password);

      return jsonObj;
    } catch {
      // console.error(
      //   'TokensService.decodeAuthToken:',
      //   `Wrong auth token: ${token}`,
      // );
      throw new UnauthorizedException();
    }
  }

  async generateTokens(userId: string) {
    const payload = {
      sub: userId,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('ACCESS_JWT_SECRET'),
      expiresIn: this.configService.getOrThrow('ACCESS_JWT_EXPIRES_IN'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow('REFRESH_JWT_SECRET'),
      expiresIn: this.configService.getOrThrow('REFRESH_JWT_EXPIRES_IN'),
    });
    return { accessToken, refreshToken };
  }
}
