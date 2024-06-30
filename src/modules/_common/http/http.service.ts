import { Injectable } from '@nestjs/common';
import { IHttpService } from './http.interface';

import axios from 'axios';

@Injectable()
export class HttpService implements IHttpService {
  async get(uri: string, headers?: any) {
    const result = await axios.get(uri, { headers });
    const { data } = result

    return data;
  }

  async post(uri: string, body: object, headers?: object | undefined) {
    const { data } = await axios.post(uri, body, { headers });

    return data;
  }
}
