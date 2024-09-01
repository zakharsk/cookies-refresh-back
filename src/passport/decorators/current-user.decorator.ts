import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (name: string, ctx: ExecutionContext): User => {
    const request: Request = ctx.switchToHttp().getRequest();
    return request.user as User;
  },
);
