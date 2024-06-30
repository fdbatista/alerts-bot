import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

const DATA = [
    { id: 1, strategy_id: 1, asset_id: 4, signal_id: 4, is_active: true, },
    { id: 2, strategy_id: 1, asset_id: 4, signal_id: 5, is_active: true, },
]

const UP_QUERY = `insert into strategy_signal (id, strategy_id, asset_id, signal_id, is_active) values ($1, $2, $3, $4, $5)`

export class CreateStrategySignalTable1719741732321 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'strategy_signal',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'strategy_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'signal_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'asset_id',
                        type: 'int',
                        isNullable: false,
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
            'strategy_signal',
            new TableForeignKey({
                columnNames: ['asset_id'],
                referencedTableName: 'asset',
                referencedColumnNames: ['id'],
                onUpdate: 'cascade',
                onDelete: 'cascade',
            }),
        );

        const queries = DATA.map(item => queryRunner.query(UP_QUERY, Object.values(item)));
        await Promise.allSettled(queries);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('strategy_signal');
    }

}
