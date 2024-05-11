import { Injectable } from '@nestjs/common';
import { IHttpService } from './http.interface';

import axios from 'axios';

@Injectable()
export class HttpService implements IHttpService {
  async get(uri: string, headers?: any) {
    return await axios.get(uri, { headers });
  }

  async post(uri: string, body: object, headers?: object | undefined) {
    return await axios.post(uri, body, { headers });
  }
}
