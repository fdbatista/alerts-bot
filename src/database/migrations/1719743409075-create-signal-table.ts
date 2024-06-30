import { MigrationInterface, QueryRunner, Table } from "typeorm";

const DATA = [
    { id: 1, name: 'RSI below 35 in 1 minute candles', candlestick_minutes: 1 },
    { id: 2, name: 'RSI below 35 in 5 minute candles', candlestick_minutes: 5 },
    { id: 3, name: 'STOCH values below 20 in 1 minute candles', candlestick_minutes: 1 },
    { id: 4, name: 'STOCH values below 20 in 5 minute candles', candlestick_minutes: 5 },
    { id: 5, name: 'Current price over last peak', candlestick_minutes: 1 },
    { id: 6, name: 'Current price over tendency line', candlestick_minutes: 1 },
]

const UP_QUERY = `insert into signal (id, name, candlestick_minutes) values ($1, $2, $3)`

export class CreateSignalTable1719743409075 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'signal',
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
                        name: 'candlestick_minutes',
                        type: 'int',
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
        await queryRunner.dropTable('signal');
    }

}
