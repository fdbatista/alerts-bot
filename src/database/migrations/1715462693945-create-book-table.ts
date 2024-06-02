import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateBookTable1715462693945 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'book',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'description',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(`insert into book (name, description) values ('BTC_USD', 'Bitcoin/USD book')`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('book');
  }
}
