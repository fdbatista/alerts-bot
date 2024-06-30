import { Injectable } from '@nestjs/common';
import { IExchangeConnector } from '../_abstraction/exchange-connector.interface';
import { EnvService } from 'src/modules/_common/env/env.service';
import { HttpService } from 'src/modules/_common/http/http.service';
import { TickerDTO, TickerRemoteResponse } from 'src/modules/_common/dto/ticker-dto';
import { DTOFactory } from 'src/modules/_common/dto/dto-factory';
import { BookDTO, BookRemoteResponse } from 'src/modules/_common/dto/book-dto';

interface IBitsoConnectionParams {
  baseUrl: string;
  apiKey: string;
  apiSecret: string;
}

const RELEVANT_BOOKS = ['btc_usd'];

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

  async getBooks(): Promise<BookDTO[]> {
    const endpoint = this.buildEndpointURL(`available_books`);
    const { payload: result } = await this.httpService.get(endpoint);

    return result.filter((item: BookRemoteResponse) => {
      const { book } = item;
      return RELEVANT_BOOKS.includes(book);
    }).map((item: BookRemoteResponse) => {
      return DTOFactory.buildBookDTO(item);
    })
  }

  async getTickers(): Promise<TickerDTO[]> {
    const endpoint = this.buildEndpointURL(`ticker?book=${RELEVANT_BOOKS[0]}`);
    const result: TickerRemoteResponse = await this.httpService.get(endpoint);

    const dto = DTOFactory.buildTickerDTO(result);

    return [dto];
  }

  private buildEndpointURL(slug: string): string {
    const { baseUrl } = this.connectionParams;
    return `${baseUrl}/${slug}`;
  }
}
