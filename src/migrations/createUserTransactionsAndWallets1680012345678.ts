import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTransactionsAndWallets1680012345678 implements MigrationInterface {
  name = 'CreateUserTransactionsAndWallets1680012345678';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`user_transactions\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`amount\` decimal(15,2) NOT NULL DEFAULT 0,
        \`status\` varchar(255) NOT NULL DEFAULT 'PENDING',
        \`payment_method\` varchar(255) NOT NULL,
        \`user_id\` int NOT NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      ALTER TABLE \`user_transactions\`
      ADD CONSTRAINT \`FK_user_transactions_user_id\`
      FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
      ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      CREATE TABLE \`wallets\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`balance\` decimal(10,2) NOT NULL DEFAULT 0,
        \`user_id\` int NOT NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` datetime(6) NULL,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB;
    `);

    await queryRunner.query(`
      ALTER TABLE \`wallets\`
      ADD CONSTRAINT \`FK_wallets_user_id\`
      FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`)
      ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`user_transactions\` DROP FOREIGN KEY \`FK_user_transactions_user_id\``);
    await queryRunner.query(`DROP TABLE \`user_transactions\``);

    await queryRunner.query(`ALTER TABLE \`wallets\` DROP FOREIGN KEY \`FK_wallets_user_id\``);
    await queryRunner.query(`DROP TABLE \`wallets\``);
  }
}
