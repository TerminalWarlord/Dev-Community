import { MigrationInterface, QueryRunner } from "typeorm";

export class AddViewsIntoPostTable1780653146675 implements MigrationInterface {
    name = 'AddViewsIntoPostTable1780653146675'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "views" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "views"`);
    }

}
