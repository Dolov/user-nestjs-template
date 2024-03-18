import { Controller, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { PermissionGuard } from './permission.guard'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @UseGuards(PermissionGuard)
  @SetMetadata('permission', 'app')
  getHello(): string {
    return `${this.appService.getHello()} - hello`;
  }

  @Get('world')
  getWorld(): string {
    return `${this.appService.getHello()} - world`;
  }
}
