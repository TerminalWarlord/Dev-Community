import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateExperienceStartDateMandatory1780553698205 implements MigrationInterface {
    name = 'UpdateExperienceStartDateMandatory1780553698205'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."experience_status_enum" AS ENUM('ACTIVE', 'DELETED')`);
        await queryRunner.query(`ALTER TABLE "experience" ADD "status" "public"."experience_status_enum" NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "experience" ALTER COLUMN "startDate" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "experience" ALTER COLUMN "startDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "experience" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."experience_status_enum"`);
    }

}
