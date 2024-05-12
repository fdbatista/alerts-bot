import { Injectable } from '@nestjs/common';
import { IHttpService } from './http.interface';

import axios from 'axios';

@Injectable()
export class HttpService implements IHttpService {
  async get(uri: string, headers?: any) {
    const {
      data: { payload },
    } = await axios.get(uri, { headers });

    return payload;
  }

  async post(uri: string, body: object, headers?: object | undefined) {
    const {
      data: { payload },
    } = await axios.post(uri, body, { headers });

    return payload;
  }
}
