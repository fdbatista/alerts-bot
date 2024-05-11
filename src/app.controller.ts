import { Controller, Get } from '@nestjs/common';
import { AppService, IServiceStatus } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  getDefault(): IServiceStatus {
    return this.appService.getServiceStatus();
  }
}
