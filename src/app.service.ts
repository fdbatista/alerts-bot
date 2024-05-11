import { Injectable } from '@nestjs/common';
import { EnvService } from './modules/_common/env/env.service';

export interface IServiceStatus {
  name: string;
  description: string;
  version: string;
  uptime: string;
}

@Injectable()
export class AppService {
  constructor(private readonly envService: EnvService) {}

  getServiceStatus(): IServiceStatus {
    const name = this.envService.getValue('APP_NAME');
    const description = this.envService.getValue('APP_DESCRIPTION');
    const version = this.envService.getValue('APP_VERSION');
    const uptime = this.getUptime();

    return {
      name,
      description,
      version,
      uptime,
    };
  }

  private getUptime() {
    const seconds = Math.round(process.uptime());
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = minutes > 0 ? seconds - minutes * 60 : seconds;

    return `${days}D ${hours.toString().padStart(2, '0')}H ${minutes.toString().padStart(2, '0')}M ${remainingSeconds}S`;
  }
}
