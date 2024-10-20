import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnGender1729399070109 implements MigrationInterface {
  name = 'AddColumnGender1729399070109';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`gender\` enum ('male', 'female', 'other') NULL`);
    await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`name\` \`name\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`gender\``);
  }
}
