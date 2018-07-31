import { MigrationInterface, QueryRunner } from 'typeorm';

export class PushMigration1532364344863 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      `CREATE TABLE "public"."push-subscription-keys" ("id" SERIAL NOT NULL, "p256dh" character varying NOT NULL, "auth" character varying NOT NULL, CONSTRAINT "PK_56dd9052787f5697ac3ebdaed58" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      `CREATE TABLE "public"."push-subsciption" ("endpoint" character varying NOT NULL, "keysId" integer, CONSTRAINT "REL_c957af2e002710f435c3cf8337" UNIQUE ("keysId"), CONSTRAINT "PK_f0a6674958b67b1bc44167f67f8" PRIMARY KEY ("endpoint"))`
    );
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      `CREATE TABLE "public"."push-subscription-topic" ("name" character varying NOT NULL, "subscriptionEndpoint" character varying NOT NULL, CONSTRAINT "PK_a744c4f452a42da3bf72c31519a" PRIMARY KEY ("name", "subscriptionEndpoint"))`
    );
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      `ALTER TABLE "public"."push-subsciption" ADD CONSTRAINT "FK_c957af2e002710f435c3cf8337b" FOREIGN KEY ("keysId") REFERENCES "public"."push-subscription-keys"("id")`
    );
    await queryRunner.query(
      // tslint:disable-next-line:max-line-length
      `ALTER TABLE "public"."push-subscription-topic" ADD CONSTRAINT "FK_0b863673288f29107ad69bc6f9f" FOREIGN KEY ("subscriptionEndpoint") REFERENCES "public"."push-subsciption"("endpoint")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "public"."push-subscription-topic" DROP CONSTRAINT "FK_0b863673288f29107ad69bc6f9f"`
    );
    await queryRunner.query(
      `ALTER TABLE "public"."push-subsciption" DROP CONSTRAINT "FK_c957af2e002710f435c3cf8337b"`
    );
    await queryRunner.query(`DROP TABLE "public"."push-subscription-topic"`);
    await queryRunner.query(`DROP TABLE "public"."push-subsciption"`);
    await queryRunner.query(`DROP TABLE "public"."push-subscription-keys"`);
  }
}
