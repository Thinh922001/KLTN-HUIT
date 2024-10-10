import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnSpec1728527039786 implements MigrationInterface {
  name = 'AddColumnSpec1728527039786';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` ADD \`specifications\` json NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`specifications\``);
  }
}
