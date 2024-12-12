import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBannerAndCategoryTables1680012345678 implements MigrationInterface {
  name = 'CreateBannerAndCategoryTables1680012345678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE \`banner\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\` datetime(6) NULL,
          \`img\` varchar(255) NULL,
          \`public_id\` varchar(255) NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB;
      `);

    await queryRunner.query(`
        CREATE TABLE \`category_banner\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\` datetime(6) NULL,
          \`name\` varchar(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
          \`img\` varchar(255) NULL,
          \`public_id\` varchar(255) NULL,
          \`cate_id\` int NOT NULL,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB;
      `);

    await queryRunner.query(`
      ALTER TABLE \`category_banner\`
      ADD CONSTRAINT \`FK_category_banner_cate_id\`
      FOREIGN KEY (\`cate_id\`) REFERENCES \`categories\`(\`id\`)
      ON DELETE NO ACTION ON UPDATE NO ACTION;
    `);

    await queryRunner.query(`
        CREATE TABLE \`category_type\` (
          \`id\` int NOT NULL AUTO_INCREMENT,
          \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\` datetime(6) NULL,
          \`name\` varchar(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB;
      `);

    await queryRunner.query(`
      ALTER TABLE \`categories\`
      ADD COLUMN \`cate_type_id\` int NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE \`categories\`
      ADD CONSTRAINT \`FK_cate_cate_type_id\`
      FOREIGN KEY (\`cate_type_id\`) REFERENCES \`category_type\`(\`id\`)
      ON DELETE NO ACTION ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`categories\` DROP FOREIGN KEY \`FK_cate_cate_type_id\``);
    await queryRunner.query(`ALTER TABLE \`category_banner\` DROP FOREIGN KEY \`FK_category_banner_cate_id\``);
    await queryRunner.query(`ALTER TABLE \`categories\` DROP COLUMN \`cate_type_id\``);
    await queryRunner.query(`DROP TABLE \`category_banner\``);
    await queryRunner.query(`DROP TABLE \`category_type\``);
    await queryRunner.query(`DROP TABLE \`banner\``);
  }
}
