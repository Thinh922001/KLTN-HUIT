import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForeignKey1731494039581 implements MigrationInterface {
  name = 'AddForeignKey1731494039581';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`order_status_history\` ADD CONSTRAINT \`FK_1ca7d5228cf9dc589b60243933c\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user_code\` ADD CONSTRAINT \`FK_4784c842bc44452fea7673401d7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user_reaction\` ADD CONSTRAINT \`FK_4c13cb10fca23126fd2d5742176\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user_reaction\` ADD CONSTRAINT \`FK_ca2a8480af4ec8212af3a3f036f\` FOREIGN KEY (\`comment_id\`) REFERENCES \`user_comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user_comment_images\` ADD CONSTRAINT \`FK_40d9f75503744054cfe0cbffecc\` FOREIGN KEY (\`comment_id\`) REFERENCES \`user_comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );

    await queryRunner.query(
      `ALTER TABLE \`user_comment\` ADD CONSTRAINT \`FK_03a8650b43d32ee623fddc8faac\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE \`user_comment\` ADD CONSTRAINT \`FK_19afe917adefff0f6fcdb3ebea9\` FOREIGN KEY (\`parent_id\`) REFERENCES \`user_comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.log('No handle');
  }
}
