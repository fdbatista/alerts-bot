import { MigrationInterface, QueryRunner, Table } from 'typeorm';

const DATA = [
    { id: 1, name: 'Potential entrypoint by break in Tesla', is_active: true, },
    { id: 2, name: 'Potential entrypoint by indicators in Tesla', is_active: true, },
    { id: 3, name: 'Potential entrypoint by break in Bitcoin', is_active: true, },
]

const UP_QUERY = `insert into strategy (id, name, is_active) values ($1, $2, $3)`

export class CreateStrategyTable1719741732321 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'strategy',
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
        
        const queries = DATA.map(item => queryRunner.query(UP_QUERY, Object.values(item)));
        await Promise.allSettled(queries);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('strategy');
    }

}
