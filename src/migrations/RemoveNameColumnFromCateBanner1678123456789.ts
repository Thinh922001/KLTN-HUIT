import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveNameColumnFromCateBanner1678123456789 implements MigrationInterface {
  name = 'RemoveNameColumnFromCateBanner1678123456789';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`category_banner\` DROP COLUMN \`name\`;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Not hanlde');
  }
}
