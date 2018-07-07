import { MigrationInterface, QueryRunner } from 'typeorm';

export class CommentMigration1530974905230 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('comments', 'ip');
    await queryRunner.query(
      `ALTER TABLE comments
      ALTER COLUMN update_time TYPE TIMESTAMP USING to_timestamp(update_time),
      ALTER COLUMN post_time TYPE TIMESTAMP USING to_timestamp(post_time)`
    );
    await queryRunner.query(
      `ALTER TABLE comments
      ALTER COLUMN update_time SET DEFAULT now(),
      ALTER COLUMN post_time SET DEFAULT now()`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE comments
      ALTER COLUMN update_time TYPE INTEGER USING extract(epch from update_time),
      ALTER COLUMN post_time TYPE INTEGER USING extract(epch from post_time)`
    );
  }
}
