import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnPublicId1728620677688 implements MigrationInterface {
  name = 'AddColumnPublicId1728620677688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product_details_img\` ADD \`public_id\` varchar(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`product_details_img\` DROP COLUMN \`public_id\``);
  }
}
