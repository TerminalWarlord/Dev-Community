import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTotalUpvoteCountInThePostTable1780565232916 implements MigrationInterface {
    name = 'AddTotalUpvoteCountInThePostTable1780565232916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "totalUpvotes" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "totalUpvotes"`);
    }

}
