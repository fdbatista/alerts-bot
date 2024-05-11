import { Injectable } from '@nestjs/common';
import { DEFAULT_VALUES } from './_constants';

@Injectable()
export class EnvService {
  private env: any;

  constructor() {
    this.env = process.env
  }
  
  getAppVersion(): number {
    return this.env.APP_VERSION ?? DEFAULT_VALUES.APP_VERSION
  }

  getAppDescription(): string {
    return this.env.APP_DESCRIPTION ?? DEFAULT_VALUES.APP_DESCRIPTION
  }
}
