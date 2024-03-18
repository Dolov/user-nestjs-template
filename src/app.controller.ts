import { Controller, Get, Inject, SetMetadata } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import { AppService } from './app.service';
import { SetPermission } from './utils'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService
  ) {}

  @Get('hello')
  @SetPermission('app')
  getHello(): string {
    return `${this.appService.getHello()} - hello`;
  }

  @Get('world')
  getWorld(): string {
    return `${this.appService.getHello()} - world`;
  }

  @Get('config')
  getConfig(): string {
    return this.configService.get('aaa')
  }
}
