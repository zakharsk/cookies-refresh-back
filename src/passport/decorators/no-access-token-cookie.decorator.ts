import { SetMetadata } from '@nestjs/common';
import { noAccessTokenCookieKey } from '../../constants';

export const NoAccessTokenCookie = () =>
  SetMetadata(noAccessTokenCookieKey, true);
