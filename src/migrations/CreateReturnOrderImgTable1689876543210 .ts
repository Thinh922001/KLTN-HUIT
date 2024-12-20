import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReturnOrderImgTable1689876543210 implements MigrationInterface {
  name = 'CreateReturnOrderImgTable1689876543210';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`return_order_img\` (
        \`id\` INT AUTO_INCREMENT PRIMARY KEY,
        \`created_at\` DATETIME DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        \`deleted_at\` DATETIME NULL,
        \`img\` VARCHAR(255) NULL,
        \`public_id\` VARCHAR(255) NULL,
        \`return_order_id\` INT NOT NULL,
        CONSTRAINT \`FK_return_order_img_return_order\`
        FOREIGN KEY (\`return_order_id\`) 
        REFERENCES \`return_order\` (\`id\`)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE \`return_order_img\`;
    `);
  }
}
