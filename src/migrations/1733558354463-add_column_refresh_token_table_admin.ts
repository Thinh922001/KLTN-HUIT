import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnRefreshTokenTableAdmin1733558354463 implements MigrationInterface {
  name = 'AddColumnRefreshTokenTableAdmin1733558354463';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`admin\` ADD \`refresh_token\` mediumtext NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`admin\` DROP COLUMN \`refresh_token\``);
  }
}
