import { Injectable } from '@nestjs/common';
import { EnvService } from './modules/_common/env/env.service';

@Injectable()
export class AppService {

  constructor(private readonly envService: EnvService) {}

  getVersion(): number {
    return this.envService.getAppVersion();
  }

  getAppDescription(): string {
    return this.envService.getAppDescription();
  }
}
