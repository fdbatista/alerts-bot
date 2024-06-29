import { MigrationInterface, QueryRunner } from 'typeorm';

const BOOKS = [
  { external_id: 913257561, name: 'NVIDIA', symbol: 'NVDA', is_active: true,  },
  { external_id: 913254235, name: 'AMD', symbol: 'AMD', is_active: true },
  { external_id: 913256180, name: 'AMAZON', symbol: 'AMZN', is_active: true },
  { external_id: 913255598, name: 'TESLA', symbol: 'TSLA', is_active: true },
  { external_id: 913354090, name: 'NASDAQ', symbol: 'IXIC', is_active: true },
  { external_id: 913303964, name: 'GOOGLE', symbol: 'GOOG', is_active: true },
  { external_id: 913323997, name: 'MICROSOFT', symbol: 'MSFT', is_active: true },
  { external_id: 950160802, name: 'BITCOIN', symbol: 'BTCUSD', is_active: false },
]

const UP_QUERY = `insert into book (external_id, name, symbol, is_active) values ($1, $2, $3, $4)`
const DOWN_QUERY = 'delete from book'

export class PopulateTickerTable1715462707132 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = BOOKS.map(book => queryRunner.query(UP_QUERY, [book.external_id, book.name, book.symbol, book.is_active]));

    await Promise.all(queries);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(DOWN_QUERY);
  }
}
