import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1695726366762 implements MigrationInterface {
  name = 'updateRefreshToken1695726366762';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`refreshToken\` mediumtext NULL`);
    await queryRunner.query(`ALTER TABLE \`doctors\` ADD \`refreshToken\` mediumtext NULL`);
    await queryRunner.query(`ALTER TABLE \`admins\` ADD \`refreshToken\` mediumtext NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`admins\` DROP COLUMN \`refreshToken\``);
    await queryRunner.query(`ALTER TABLE \`doctors\` DROP COLUMN \`refreshToken\``);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`refreshToken\``);
  }
}
