import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCommentTableSelfReferencingRelationship1780633429271 implements MigrationInterface {
    name = 'UpdateCommentTableSelfReferencingRelationship1780633429271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_99bcc8c543bcb53aa0eacbacfd8"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "childrenId"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "parentId" integer`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "userId" integer`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_e3aebe2bd1c53467a07109be596" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_e3aebe2bd1c53467a07109be596"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "childrenId" integer`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_99bcc8c543bcb53aa0eacbacfd8" FOREIGN KEY ("childrenId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
