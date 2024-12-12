import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropTableGift1680012345679 implements MigrationInterface {
  name = 'DropTableGift1680012345679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS \`gift\`;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('Not hanlde');
  }
}
