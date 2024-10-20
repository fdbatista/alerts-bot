import { MigrationInterface, QueryRunner } from "typeorm";

export class AdjustTickerTable1729444850233 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('ticker', ['id', 'low', 'high', 'open', 'volume']);
        await queryRunner.createPrimaryKey('ticker', ['timestamp', 'asset_id']);
        await queryRunner.renameColumn('ticker', 'close', 'price');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }
}
