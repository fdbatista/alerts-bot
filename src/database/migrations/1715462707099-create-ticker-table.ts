import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateTickerTable1715462707099 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'ticker',
        columns: [
          {
            name: 'timestamp',
            type: 'timestamp with time zone',
            isNullable: false,
            isPrimary: true,
          },
          {
            name: 'asset_id',
            type: 'int',
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
            name: 'open',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'close',
            type: 'float',
            isNullable: false,
          },
          {
            name: 'volume',
            type: 'float',
            isNullable: true,
          },
        ],
        indices: [
          { columnNames: ['asset_id'], isUnique: false },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'ticker',
      new TableForeignKey({
        columnNames: ['asset_id'],
        referencedTableName: 'asset',
        referencedColumnNames: ['id'],
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    );

    await queryRunner.query(`create extension if not exists timescaledb cascade`);
    await queryRunner.query(`select create_hypertable('ticker', 'timestamp')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('ticker');
  }
}
