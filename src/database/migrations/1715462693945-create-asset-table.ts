import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

const DATA = [
  { id: 1, type_id: 2, external_id: 913257561, name: 'NVIDIA', symbol: 'NVDA', is_active: true, },
  { id: 2, type_id: 2, external_id: 913254235, name: 'AMD', symbol: 'AMD', is_active: true },
  { id: 3, type_id: 2, external_id: 913256180, name: 'AMAZON', symbol: 'AMZN', is_active: true },
  { id: 4, type_id: 2, external_id: 913255598, name: 'TESLA', symbol: 'TSLA', is_active: true },
  { id: 5, type_id: 2, external_id: 913354090, name: 'NASDAQ', symbol: 'IXIC', is_active: true },
  { id: 6, type_id: 2, external_id: 913303964, name: 'GOOGLE', symbol: 'GOOG', is_active: true },
  { id: 7, type_id: 2, external_id: 913323997, name: 'MICROSOFT', symbol: 'MSFT', is_active: true },
  { id: 8, type_id: 1, external_id: 950160802, name: 'BITCOIN', symbol: 'BTCUSD', is_active: true },
]

const UP_QUERY = `insert into asset (id, type_id, external_id, name, symbol, is_active) values ($1, $2, $3, $4, $5, $6)`

export class CreateAssetTable1715462693945 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'asset',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'type_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'external_id',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'symbol',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'is_active',
            type: 'boolean',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'asset',
      new TableForeignKey({
        columnNames: ['type_id'],
        referencedTableName: 'asset_type',
        referencedColumnNames: ['id'],
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    );

    const queries = DATA.map(item => queryRunner.query(UP_QUERY, Object.values(item)));
    await Promise.allSettled(queries);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('asset');
  }

}
