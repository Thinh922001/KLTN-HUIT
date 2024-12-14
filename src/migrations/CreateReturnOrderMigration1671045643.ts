import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateReturnOrderMigration1671045643 implements MigrationInterface {
  name = 'CreateReturnOrderMigration1734162650945';
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE return_order (
        id INT PRIMARY KEY AUTO_INCREMENT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        status VARCHAR(255) NOT NULL,
        is_approved BOOLEAN DEFAULT FALSE,
        reason MEDIUMTEXT NULL,
        quantity INT UNSIGNED DEFAULT 0,
        order_id INT NOT NULL,
        product_detail_id INT NOT NULL,
        user_id INT NOT NULL
      );
    `);

    await queryRunner.query(`
        ALTER TABLE \`return_order\`
        ADD CONSTRAINT \`FK_return_order_order_id\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE CASCADE;
      `);

    await queryRunner.query(`
        ALTER TABLE \`return_order\`
        ADD CONSTRAINT \`FK_return_order_product_detail_id\` FOREIGN KEY (\`product_detail_id\`) REFERENCES \`product_details\`(\`id\`) ON DELETE CASCADE;
      `);

    await queryRunner.query(`
        ALTER TABLE \`return_order\`
        ADD CONSTRAINT \`FK_return_order_user_id\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE return_order DROP FOREIGN KEY FK_order_id;`);
    await queryRunner.query(`ALTER TABLE return_order DROP FOREIGN KEY FK_product_detail_id;`);
    await queryRunner.query(`ALTER TABLE return_order DROP FOREIGN KEY FK_user_id;`);
    await queryRunner.query(`DROP TABLE return_order;`);
  }
}
