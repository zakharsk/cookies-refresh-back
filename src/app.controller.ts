import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { NoAccessTokenCookie } from './passport/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  main() {
    return this.appService.main();
  }

  @NoAccessTokenCookie()
  @Get('healthz')
  healthCheck() {
    return {
      name: process.env.npm_package_name,
      version: process.env.npm_package_version,
      description: process.env.npm_package_description,
      homepage: process.env.npm_package_homepage,
    };
  }
}
