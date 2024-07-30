import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateStochTable1722029837788 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
          new Table({
            name: 'stoch',
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
                name: 'k',
                type: 'float',
                isNullable: false,
              },
              {
                name: 'd',
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
          'stoch',
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
        await queryRunner.dropTable('stoch');
      }

}
