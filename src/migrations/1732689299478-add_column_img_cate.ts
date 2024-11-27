import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnImgCate1732689299478 implements MigrationInterface {
  name = 'AddColumnImgCate1732689299478';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`categories\` ADD \`img\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`img\``);
  }
}
