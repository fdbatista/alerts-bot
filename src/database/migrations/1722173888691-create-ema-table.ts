import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateEmaTable1722173888691 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'ema',
            columns: [
              {
                name: 'id',
                type: 'int',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
              },
              {
                name: 'timestamp',
                type: 'timestamp with time zone',
                isNullable: false,
              },
              {
                name: 'asset_id',
                type: 'int',
                isNullable: false,
              },
              {
                name: 'minutes',
                type: 'int',
                isNullable: false,
              },
              {
                name: 'value',
                type: 'float',
                isNullable: false,
              },
            ],
            indices: [
              { columnNames: ['asset_id', 'minutes', 'timestamp'], isUnique: true },
            ],
          }),
          true,
        );
    
        await queryRunner.createForeignKey(
          'ema',
          new TableForeignKey({
            columnNames: ['asset_id'],
            referencedTableName: 'asset',
            referencedColumnNames: ['id'],
            onUpdate: 'cascade',
            onDelete: 'cascade',
          }),
        );
      }
    
      public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('ema');
      }

}
