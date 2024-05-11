import { Injectable } from '@nestjs/common';
import { DEFAULT_VALUES } from './_constants';

@Injectable()
export class EnvService {
  private env: any;

  constructor() {
    this.env = process.env
  }
  
  getValue(key: string): string {
    return this.env[key] ?? DEFAULT_VALUES.EMPTY_STRING
  }
}
