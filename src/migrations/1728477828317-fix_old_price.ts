import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixOldPrice1728477828317 implements MigrationInterface {
  name = 'FixOldPrice1728477828317';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` ADD \`product_code\` varchar(50) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`product_code\``);
  }
}
