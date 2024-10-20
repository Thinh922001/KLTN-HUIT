import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnPublicIdAddFkProduct1729423691976 implements MigrationInterface {
  name = 'AddColumnPublicIdAddFkProduct1729423691976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_comment_images\` ADD \`public_id\` varchar(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`user_comment\` ADD \`product_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`user_comment\` ADD CONSTRAINT \`FK_3caf7af926ad059d51f429fdb50\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_comment\` DROP FOREIGN KEY \`FK_3caf7af926ad059d51f429fdb50\``);

    await queryRunner.query(`ALTER TABLE \`user_comment_images\` DROP COLUMN \`public_id\``);
  }
}
