import { MigrationInterface, QueryRunner } from 'typeorm';

const BOOKS = [
  { id: 1, name: 'btc_usd', description: 'Book for trading BTC with USD' }
]

const UP_QUERY = `insert into book (id, name, description) values ($1, $2, $3)`
const DOWN_QUERY = 'delete from book'

export class PopulateTickerTable1715462707132 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const queries = BOOKS.map(book => queryRunner.query(UP_QUERY, [book.id, book.name, book.description]));
    
    await Promise.all(queries);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(DOWN_QUERY);
  }
}
