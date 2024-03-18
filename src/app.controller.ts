import { Controller, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { SetPermission } from './utils'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @SetPermission('app')
  getHello(): string {
    return `${this.appService.getHello()} - hello`;
  }

  @Get('world')
  getWorld(): string {
    return `${this.appService.getHello()} - world`;
  }
}
