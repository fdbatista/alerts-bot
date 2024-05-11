import { Injectable } from '@nestjs/common';
import { IExchangeConnector } from '../exchange-connector.interface';
import { EnvService } from 'src/modules/_common/env/env.service';
import { HttpService } from 'src/modules/_common/http/http.service';

export interface IBitsoConnectionParams {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
}

@Injectable()
export class BitsoService implements IExchangeConnector {
  private connectionParams: IBitsoConnectionParams;

  constructor(
    private readonly httpService: HttpService,
    readonly envService: EnvService,
  ) {
    this.connectionParams = {
      baseUrl: envService.getValue('BITSO_BASE_URL'),
      apiKey: envService.getValue('BITSO_API_KEY'),
      apiSecret: envService.getValue('BITSO_API_SECRET'),
    };
  }

  async getTicker(symbol: string): Promise<object> {
    const { baseUrl } = this.connectionParams;
    const endpoint = `${baseUrl}/ticker?book=${symbol}`;

    const {
      data: { payload },
    } = await this.httpService.get(endpoint);

    return payload;
  }
}
