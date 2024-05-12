import { Injectable } from '@nestjs/common';
import { IExchangeConnector, ISymbol } from '../exchange-connector.interface';
import { EnvService } from 'src/modules/_common/env/env.service';
import { HttpService } from 'src/modules/_common/http/http.service';
import { TickerDTO } from 'src/modules/_common/dto/ticker-dto';
import { DTOFactory } from 'src/modules/_common/dto/dto-factory';

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

  async getSymbols(): Promise<ISymbol[]> {
    const endpoint = this.buildEndpointURL(`available_books`);
    return await this.httpService.get(endpoint);
  }

  async getTicker(symbol: string): Promise<TickerDTO> {
    const endpoint = this.buildEndpointURL(`ticker?book=${symbol}`);
    const result = await this.httpService.get(endpoint);

    return DTOFactory.buildTickerDTO(result)
  }

  private buildEndpointURL(slug: string): string {
    const { baseUrl } = this.connectionParams;
    return `${baseUrl}/${slug}`;
  }
}
