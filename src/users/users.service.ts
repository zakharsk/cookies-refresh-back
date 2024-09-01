import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const login = createUserDto.login;
    const passwordHash = await argon2.hash(createUserDto.password);
    return this.prismaService.user.create({ data: { login, passwordHash } });
  }

  async findAll() {
    return this.prismaService.user.findMany({
      select: { id: true, login: true },
    });
  }

  async findOne(id: string) {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  async logIn(tokenData: CreateUserDto) {
    const user = await this.prismaService.user.findUnique({
      where: { login: tokenData.login },
    });

    if (!user) {
      return this.create(tokenData);
    }

    const isHashesMatch = await argon2.verify(
      user.passwordHash,
      tokenData.password,
    );

    if (isHashesMatch) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.prismaService.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  async updateRefreshTokenHash(id: string, refreshToken: string) {
    const refreshTokenHash = await argon2.hash(refreshToken);
    await this.prismaService.user.update({
      where: { id },
      data: { refreshTokenHash },
    });
  }

  async remove(id: string) {
    return this.prismaService.user.delete({ where: { id } });
  }
}
