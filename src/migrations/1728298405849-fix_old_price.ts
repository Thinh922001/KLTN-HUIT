import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixOldPrice1728298405849 implements MigrationInterface {
  name = 'FixOldPrice1728298405849';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`text_online_type\``);
    await queryRunner.query(`ALTER TABLE \`products\` ADD \`textOnlineType\` tinyint UNSIGNED NULL`);
    await queryRunner.query(`ALTER TABLE \`product_details\` CHANGE \`old_price\` \`old_price\` decimal(10,2) NULL`);
    await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`old_price\` \`old_price\` decimal(10,2) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`old_price\` \`old_price\` decimal(10,2) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE \`product_details\` CHANGE \`old_price\` \`old_price\` decimal(10,2) NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`textOnlineType\``);
    await queryRunner.query(`ALTER TABLE \`products\` ADD \`text_online_type\` text NULL`);
  }
}
