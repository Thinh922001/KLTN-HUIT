import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableUserReaction1729427320304 implements MigrationInterface {
  name = 'AddTableUserReaction1729427320304';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user_reaction\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`reaction_type\` varchar(50) NOT NULL, \`user_id\` int NOT NULL, \`comment_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(`ALTER TABLE \`user_comment\` ADD \`total_reaction\` int UNSIGNED NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_comment\` DROP COLUMN \`total_reaction\``);
    await queryRunner.query(`DROP TABLE \`user_reaction\``);
  }
}
