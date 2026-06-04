import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSetup1780548402012 implements MigrationInterface {
    name = 'InitialSetup1780548402012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "experience" ("id" SERIAL NOT NULL, "companyName" character varying NOT NULL, "experienceTitle" character varying NOT NULL, "startDate" TIMESTAMP, "endDate" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_5e8d5a534100e1b17ee2efa429a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "skill" ("id" SERIAL NOT NULL, "skillTitle" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c14cb5ed4e10d0d1e4235eb94a8" UNIQUE ("skillTitle"), CONSTRAINT "PK_a0d33334424e64fb78dc3ce7196" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_skill_status_enum" AS ENUM('DELETED', 'ACTIVE')`);
        await queryRunner.query(`CREATE TABLE "user_skill" ("id" SERIAL NOT NULL, "status" "public"."user_skill_status_enum" NOT NULL DEFAULT 'ACTIVE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "skillId" integer, CONSTRAINT "PK_42557e0ad33b670a55b7bd0f725" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."post_vote_votetype_enum" AS ENUM('UPVOTE', 'DOWNVOTE', 'NEUTRAL')`);
        await queryRunner.query(`CREATE TABLE "post_vote" ("id" SERIAL NOT NULL, "voteType" "public"."post_vote_votetype_enum" NOT NULL DEFAULT 'NEUTRAL', "postId" integer, "userId" integer, CONSTRAINT "PK_7de8e200bf5afdc2f67ffcb78ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_951abb925251a922a769569a11" ON "post_vote"  ("postId", "userId") `);
        await queryRunner.query(`CREATE TYPE "public"."comment_status_enum" AS ENUM('PUBLISHED', 'DELETED')`);
        await queryRunner.query(`CREATE TABLE "comment" ("id" SERIAL NOT NULL, "content" text NOT NULL, "status" "public"."comment_status_enum" NOT NULL DEFAULT 'PUBLISHED', "totalVotes" integer NOT NULL DEFAULT '0', "totalUpvotes" integer NOT NULL DEFAULT '0', "totalDownvotes" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "childrenId" integer, "postId" integer, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."post_status_enum" AS ENUM('DELETED', 'PUBLISHED', 'SCHEDULED')`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "content" text NOT NULL, "status" "public"."post_status_enum" NOT NULL DEFAULT 'PUBLISHED', "totalVotes" integer NOT NULL DEFAULT '0', "totalDownvotes" integer NOT NULL DEFAULT '0', "totalComments" integer NOT NULL DEFAULT '0', "publishAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "postedById" integer, "communityId" integer, CONSTRAINT "UQ_cd1bddce36edc3e766798eab376" UNIQUE ("slug"), CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."community_status_enum" AS ENUM('DELETED', 'BANNED', 'ACTIVE')`);
        await queryRunner.query(`CREATE TABLE "community" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "slug" character varying NOT NULL, "description" text NOT NULL, "status" "public"."community_status_enum" NOT NULL DEFAULT 'ACTIVE', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_198f18552bc2c404cc62bf3b6f6" UNIQUE ("slug"), CONSTRAINT "PK_cae794115a383328e8923de4193" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."community_role_role_enum" AS ENUM('ADMIN', 'MODERATOR', 'USER')`);
        await queryRunner.query(`CREATE TYPE "public"."community_role_status_enum" AS ENUM('INVITED', 'BANNED', 'REGULAR')`);
        await queryRunner.query(`CREATE TABLE "community_role" ("id" SERIAL NOT NULL, "role" "public"."community_role_role_enum" NOT NULL DEFAULT 'USER', "status" "public"."community_role_status_enum" NOT NULL DEFAULT 'REGULAR', "joinedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, "communityId" integer, CONSTRAINT "user_community_unique" UNIQUE ("userId", "communityId"), CONSTRAINT "PK_61795c7f2088c26e7cbc28edf9d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_provider_enum" AS ENUM('GOOGLE', 'CREDENTIALS')`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('SUPERADMIN', 'USER', 'DELETED')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "fname" character varying NOT NULL, "lname" character varying, "email" character varying NOT NULL, "password" character varying, "provider" "public"."user_provider_enum" NOT NULL DEFAULT 'CREDENTIALS', "avatar" character varying, "status" "public"."user_status_enum" NOT NULL DEFAULT 'USER', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."comment_vote_votetype_enum" AS ENUM('UPVOTE', 'DOWNVOTE', 'NEUTRAL')`);
        await queryRunner.query(`CREATE TABLE "comment_vote" ("id" SERIAL NOT NULL, "voteType" "public"."comment_vote_votetype_enum" NOT NULL DEFAULT 'NEUTRAL', "commentId" integer, "userId" integer, CONSTRAINT "PK_4b5d08afceeb89bd5da77cfd71f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9194f426d41fb9a8abc3aae511" ON "comment_vote"  ("commentId", "userId") `);
        await queryRunner.query(`ALTER TABLE "experience" ADD CONSTRAINT "FK_cbfb1d1219454c9b45f1b3c4274" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skill" ADD CONSTRAINT "FK_03260daf2df95f4492cc8eb00e6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_skill" ADD CONSTRAINT "FK_49db81d31fc330a905af3c01205" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_vote" ADD CONSTRAINT "FK_b79b839de435b6c2bcb5a9003d7" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post_vote" ADD CONSTRAINT "FK_73f58f12f594d9c4221f7f3a6dc" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_99bcc8c543bcb53aa0eacbacfd8" FOREIGN KEY ("childrenId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_94a85bb16d24033a2afdd5df060" FOREIGN KEY ("postId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_fb7ffd0860cbcc5cf22c96d3c05" FOREIGN KEY ("postedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_eff802f635e95c8aef1998b4843" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "community_role" ADD CONSTRAINT "FK_d3501227e1e96b4dcd5d751c2ef" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "community_role" ADD CONSTRAINT "FK_589bd92b7999ca0198a4dde9197" FOREIGN KEY ("communityId") REFERENCES "community"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_vote" ADD CONSTRAINT "FK_5d77d92a6925ae3fc8da14e1257" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment_vote" ADD CONSTRAINT "FK_ade7498b89296b9fb63bcd8dbdd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_vote" DROP CONSTRAINT "FK_ade7498b89296b9fb63bcd8dbdd"`);
        await queryRunner.query(`ALTER TABLE "comment_vote" DROP CONSTRAINT "FK_5d77d92a6925ae3fc8da14e1257"`);
        await queryRunner.query(`ALTER TABLE "community_role" DROP CONSTRAINT "FK_589bd92b7999ca0198a4dde9197"`);
        await queryRunner.query(`ALTER TABLE "community_role" DROP CONSTRAINT "FK_d3501227e1e96b4dcd5d751c2ef"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_eff802f635e95c8aef1998b4843"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_fb7ffd0860cbcc5cf22c96d3c05"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_94a85bb16d24033a2afdd5df060"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_99bcc8c543bcb53aa0eacbacfd8"`);
        await queryRunner.query(`ALTER TABLE "post_vote" DROP CONSTRAINT "FK_73f58f12f594d9c4221f7f3a6dc"`);
        await queryRunner.query(`ALTER TABLE "post_vote" DROP CONSTRAINT "FK_b79b839de435b6c2bcb5a9003d7"`);
        await queryRunner.query(`ALTER TABLE "user_skill" DROP CONSTRAINT "FK_49db81d31fc330a905af3c01205"`);
        await queryRunner.query(`ALTER TABLE "user_skill" DROP CONSTRAINT "FK_03260daf2df95f4492cc8eb00e6"`);
        await queryRunner.query(`ALTER TABLE "experience" DROP CONSTRAINT "FK_cbfb1d1219454c9b45f1b3c4274"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9194f426d41fb9a8abc3aae511"`);
        await queryRunner.query(`DROP TABLE "comment_vote"`);
        await queryRunner.query(`DROP TYPE "public"."comment_vote_votetype_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_provider_enum"`);
        await queryRunner.query(`DROP TABLE "community_role"`);
        await queryRunner.query(`DROP TYPE "public"."community_role_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."community_role_role_enum"`);
        await queryRunner.query(`DROP TABLE "community"`);
        await queryRunner.query(`DROP TYPE "public"."community_status_enum"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TYPE "public"."post_status_enum"`);
        await queryRunner.query(`DROP TABLE "comment"`);
        await queryRunner.query(`DROP TYPE "public"."comment_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_951abb925251a922a769569a11"`);
        await queryRunner.query(`DROP TABLE "post_vote"`);
        await queryRunner.query(`DROP TYPE "public"."post_vote_votetype_enum"`);
        await queryRunner.query(`DROP TABLE "user_skill"`);
        await queryRunner.query(`DROP TYPE "public"."user_skill_status_enum"`);
        await queryRunner.query(`DROP TABLE "skill"`);
        await queryRunner.query(`DROP TABLE "experience"`);
    }

}
