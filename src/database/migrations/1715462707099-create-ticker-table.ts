import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateTickerTable1715462707099 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ticker',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'book_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'timestamp',
            type: 'timestamp with time zone',
            isNullable: false,
          },
          {
            name: 'low',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'high',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'last',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'volume',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'vwap',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'ask',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'bid',
            type: 'float',
            isNullable: false,
          },
        ],
        indices: [
          {
            columnNames: ['book_id', 'timestamp'],
            isUnique: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'ticker',
      new TableForeignKey({
        columnNames: ['book_id'],
        referencedTableName: 'book',
        referencedColumnNames: ['id'],
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ticker');
  }
}
