import { MigrationInterface, QueryRunner } from 'typeorm';
/**
 * Old database schema (before Nest and TypeORM)
 */
export class InitialMigration1530974482534 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      `CREATE TABLE "public"."blogs" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "text" text NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT 'now()', CONSTRAINT "PK_768aaf4e781d99ce65d4b005fd8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      `CREATE TABLE "public"."comments" ("id" SERIAL NOT NULL, "username" character varying(50) NOT NULL, "message" text NOT NULL, "private" boolean NOT NULL DEFAULT 'false', "deleted" boolean NOT NULL DEFAULT 'false', "update_time" integer NOT NULL, "post_time" integer NOT NULL, CONSTRAINT "PK_58e911370e65e3d8a6f37cf6f46" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "public"."comments"`);
    await queryRunner.query(`DROP TABLE "public"."blogs"`);
  }
}
