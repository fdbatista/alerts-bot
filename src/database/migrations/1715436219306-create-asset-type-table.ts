import { MigrationInterface, QueryRunner, Table } from "typeorm";

const DATA = [
    { id: 1, name: 'Cryptocurrency', },
    { id: 2, name: 'Stock', },
    { id: 3, name: 'Forex', },
    { id: 4, name: 'Commodity', },
    { id: 5, name: 'Index', },
]

const UP_QUERY = `insert into asset_type (id, name) values ($1, $2)`

export class CreateAssetTypeTable1715436219306 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'asset_type',
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
                ],
            }),
            true,
        );

        const queries = DATA.map(item => queryRunner.query(UP_QUERY, [item.id, item.name]));
        await Promise.allSettled(queries);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('asset_type');
    }

}
