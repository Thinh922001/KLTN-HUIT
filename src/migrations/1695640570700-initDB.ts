import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1695640570700 implements MigrationInterface {
    name = 'initDB1695640570700'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`doctors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`phone\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`account_type\` enum ('1', '2', '3') NULL, \`sns_type\` enum ('1', '2', '3', '4') NULL, UNIQUE INDEX \`IDX_62069f52ebba471c91de5d59d6\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`doctor_noti\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`title\` varchar(255) NOT NULL DEFAULT 0, \`content\` mediumtext NULL, \`doctor_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admins\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`is_admin\` tinyint NOT NULL DEFAULT 1, \`status\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_051db7d37d478a69a7432df147\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`area\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL DEFAULT 0, \`status\` tinyint NULL DEFAULT 1, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`clinics\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL DEFAULT 0, \`location_name\` varchar(255) NULL, \`longitude\` decimal(11,8) NOT NULL, \`latitude\` decimal(10,8) NOT NULL, \`image\` varchar(255) NULL, \`phone\` varchar(15) NULL, \`na\` varchar(255) NOT NULL DEFAULT 0, \`area_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`brands\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`items_type\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL DEFAULT 0, \`image\` varchar(255) NULL, \`info\` text NOT NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`description\` mediumtext NULL, \`ingredient\` mediumtext NULL, \`user_guide\` mediumtext NULL, \`preserve\` mediumtext NULL, \`cost\` bigint NULL DEFAULT '0', \`brand_id\` int NOT NULL, \`category_id\` int NOT NULL, \`item_type_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`phone\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`account_type\` enum ('1', '2', '3') NULL, \`sns_type\` enum ('1', '2', '3', '4') NULL, UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`carts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`amount\` int NOT NULL DEFAULT '1', \`total_amount\` bigint NOT NULL DEFAULT '0', \`expired_at\` datetime NULL, \`item_id\` int NOT NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_comment_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`message\` mediumtext NULL, \`rate\` int NULL DEFAULT '5', \`date\` datetime NULL, \`user_id\` int NOT NULL, \`item_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`doctor_sns\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`sns_service_type\` enum ('1', '2', '3', '4') NOT NULL, \`name\` varchar(255) NULL, \`account_sns_id\` varchar(260) NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_clinic\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`date\` datetime NULL, \`status\` tinyint NULL DEFAULT 0, \`user_id\` int NOT NULL, \`clinic_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_doctor_chats\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`date\` date NOT NULL, \`message\` text NULL, \`user_id\` int NOT NULL, \`doctor_id\` int NOT NULL, UNIQUE INDEX \`IDX_f69d04c80bcfacb761a37fbeae\` (\`date\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_noti\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`title\` varchar(255) NOT NULL DEFAULT 0, \`content\` mediumtext NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`date\` date NULL, \`total_amout\` bigint NULL, \`status\` tinyint NULL DEFAULT 0, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_doctor_health_care\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) NOT NULL DEFAULT 0, \`cost\` bigint NOT NULL DEFAULT '0', \`status\` tinyint NULL DEFAULT 1, \`user_id\` int NOT NULL, \`doctor_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_order_detail\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`amout\` int NULL DEFAULT '0', \`total_amount\` bigint NULL DEFAULT '0', \`user_order_id\` int NOT NULL, \`item_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_sns\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`sns_service_type\` enum ('1', '2', '3', '4') NOT NULL, \`name\` varchar(255) NULL, \`account_sns_id\` varchar(260) NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_profiles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`avatar\` varchar(255) NULL, \`name\` varchar(255) NULL, \`gender\` enum ('0', '1', '2') NULL DEFAULT '0', \`birth_date\` date NULL, \`height\` decimal(5,2) UNSIGNED NULL DEFAULT '0.00', \`weight\` decimal(5,2) UNSIGNED NULL DEFAULT '0.00', \`blood_group\` varchar(5) NULL, \`user_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`doctor_noti\` ADD CONSTRAINT \`FK_f63f39a6c2e4be249ad94bb6fae\` FOREIGN KEY (\`doctor_id\`) REFERENCES \`doctors\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`clinics\` ADD CONSTRAINT \`FK_21f32ccec0457500096e4e9f277\` FOREIGN KEY (\`area_id\`) REFERENCES \`area\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD CONSTRAINT \`FK_6ed953a2c457e2e41a6893706a2\` FOREIGN KEY (\`brand_id\`) REFERENCES \`brands\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD CONSTRAINT \`FK_0c4aa809ddf5b0c6ca45d8a8e80\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD CONSTRAINT \`FK_93f02a9196a53d0f4b2412aa42c\` FOREIGN KEY (\`item_type_id\`) REFERENCES \`items_type\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`carts\` ADD CONSTRAINT \`FK_924f7270615d8b881ff1d562175\` FOREIGN KEY (\`item_id\`) REFERENCES \`items\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`carts\` ADD CONSTRAINT \`FK_2ec1c94a977b940d85a4f498aea\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_comment_item\` ADD CONSTRAINT \`FK_7df8ab8299a90d8e1ecaece634d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_comment_item\` ADD CONSTRAINT \`FK_8dcc7b93854aa0d6d3936f72e4a\` FOREIGN KEY (\`item_id\`) REFERENCES \`items\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`doctor_sns\` ADD CONSTRAINT \`FK_59fd50d340c5559c0f15a879172\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_clinic\` ADD CONSTRAINT \`FK_9b3f3fe776fe62330431a403227\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_clinic\` ADD CONSTRAINT \`FK_71bdb0118d45a6d02bfc6702b70\` FOREIGN KEY (\`clinic_id\`) REFERENCES \`clinics\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_doctor_chats\` ADD CONSTRAINT \`FK_450b32ef9812348203c0eae362d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_doctor_chats\` ADD CONSTRAINT \`FK_5a9f98ce29c403a4b3944fff52e\` FOREIGN KEY (\`doctor_id\`) REFERENCES \`doctors\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_noti\` ADD CONSTRAINT \`FK_6ade26f3b5803cf1d7c6d86390d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_orders\` ADD CONSTRAINT \`FK_c0a88dd2dd7386e80a375aa7f3c\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_doctor_health_care\` ADD CONSTRAINT \`FK_28faf8b5fb2df9b6cb3be05bf52\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_doctor_health_care\` ADD CONSTRAINT \`FK_ff9548982050575dcdd37c23a4a\` FOREIGN KEY (\`doctor_id\`) REFERENCES \`doctors\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_order_detail\` ADD CONSTRAINT \`FK_dc946f1674bbd486f3ce9170abe\` FOREIGN KEY (\`user_order_id\`) REFERENCES \`user_orders\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_order_detail\` ADD CONSTRAINT \`FK_8dff3516ef2495ce6d64c5e52dc\` FOREIGN KEY (\`item_id\`) REFERENCES \`items\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_sns\` ADD CONSTRAINT \`FK_c4817611a5ca4e418abc2f4367d\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`user_profiles\` ADD CONSTRAINT \`FK_6ca9503d77ae39b4b5a6cc3ba88\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profiles\` DROP FOREIGN KEY \`FK_6ca9503d77ae39b4b5a6cc3ba88\``);
        await queryRunner.query(`ALTER TABLE \`user_sns\` DROP FOREIGN KEY \`FK_c4817611a5ca4e418abc2f4367d\``);
        await queryRunner.query(`ALTER TABLE \`user_order_detail\` DROP FOREIGN KEY \`FK_8dff3516ef2495ce6d64c5e52dc\``);
        await queryRunner.query(`ALTER TABLE \`user_order_detail\` DROP FOREIGN KEY \`FK_dc946f1674bbd486f3ce9170abe\``);
        await queryRunner.query(`ALTER TABLE \`user_doctor_health_care\` DROP FOREIGN KEY \`FK_ff9548982050575dcdd37c23a4a\``);
        await queryRunner.query(`ALTER TABLE \`user_doctor_health_care\` DROP FOREIGN KEY \`FK_28faf8b5fb2df9b6cb3be05bf52\``);
        await queryRunner.query(`ALTER TABLE \`user_orders\` DROP FOREIGN KEY \`FK_c0a88dd2dd7386e80a375aa7f3c\``);
        await queryRunner.query(`ALTER TABLE \`user_noti\` DROP FOREIGN KEY \`FK_6ade26f3b5803cf1d7c6d86390d\``);
        await queryRunner.query(`ALTER TABLE \`user_doctor_chats\` DROP FOREIGN KEY \`FK_5a9f98ce29c403a4b3944fff52e\``);
        await queryRunner.query(`ALTER TABLE \`user_doctor_chats\` DROP FOREIGN KEY \`FK_450b32ef9812348203c0eae362d\``);
        await queryRunner.query(`ALTER TABLE \`user_clinic\` DROP FOREIGN KEY \`FK_71bdb0118d45a6d02bfc6702b70\``);
        await queryRunner.query(`ALTER TABLE \`user_clinic\` DROP FOREIGN KEY \`FK_9b3f3fe776fe62330431a403227\``);
        await queryRunner.query(`ALTER TABLE \`doctor_sns\` DROP FOREIGN KEY \`FK_59fd50d340c5559c0f15a879172\``);
        await queryRunner.query(`ALTER TABLE \`user_comment_item\` DROP FOREIGN KEY \`FK_8dcc7b93854aa0d6d3936f72e4a\``);
        await queryRunner.query(`ALTER TABLE \`user_comment_item\` DROP FOREIGN KEY \`FK_7df8ab8299a90d8e1ecaece634d\``);
        await queryRunner.query(`ALTER TABLE \`carts\` DROP FOREIGN KEY \`FK_2ec1c94a977b940d85a4f498aea\``);
        await queryRunner.query(`ALTER TABLE \`carts\` DROP FOREIGN KEY \`FK_924f7270615d8b881ff1d562175\``);
        await queryRunner.query(`ALTER TABLE \`items\` DROP FOREIGN KEY \`FK_93f02a9196a53d0f4b2412aa42c\``);
        await queryRunner.query(`ALTER TABLE \`items\` DROP FOREIGN KEY \`FK_0c4aa809ddf5b0c6ca45d8a8e80\``);
        await queryRunner.query(`ALTER TABLE \`items\` DROP FOREIGN KEY \`FK_6ed953a2c457e2e41a6893706a2\``);
        await queryRunner.query(`ALTER TABLE \`clinics\` DROP FOREIGN KEY \`FK_21f32ccec0457500096e4e9f277\``);
        await queryRunner.query(`ALTER TABLE \`doctor_noti\` DROP FOREIGN KEY \`FK_f63f39a6c2e4be249ad94bb6fae\``);
        await queryRunner.query(`DROP TABLE \`user_profiles\``);
        await queryRunner.query(`DROP TABLE \`user_sns\``);
        await queryRunner.query(`DROP TABLE \`user_order_detail\``);
        await queryRunner.query(`DROP TABLE \`user_doctor_health_care\``);
        await queryRunner.query(`DROP TABLE \`user_orders\``);
        await queryRunner.query(`DROP TABLE \`user_noti\``);
        await queryRunner.query(`DROP INDEX \`IDX_f69d04c80bcfacb761a37fbeae\` ON \`user_doctor_chats\``);
        await queryRunner.query(`DROP TABLE \`user_doctor_chats\``);
        await queryRunner.query(`DROP TABLE \`user_clinic\``);
        await queryRunner.query(`DROP TABLE \`doctor_sns\``);
        await queryRunner.query(`DROP TABLE \`user_comment_item\``);
        await queryRunner.query(`DROP TABLE \`carts\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`items\``);
        await queryRunner.query(`DROP TABLE \`items_type\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP TABLE \`brands\``);
        await queryRunner.query(`DROP TABLE \`clinics\``);
        await queryRunner.query(`DROP TABLE \`area\``);
        await queryRunner.query(`DROP INDEX \`IDX_051db7d37d478a69a7432df147\` ON \`admins\``);
        await queryRunner.query(`DROP TABLE \`admins\``);
        await queryRunner.query(`DROP TABLE \`doctor_noti\``);
        await queryRunner.query(`DROP INDEX \`IDX_62069f52ebba471c91de5d59d6\` ON \`doctors\``);
        await queryRunner.query(`DROP TABLE \`doctors\``);
    }

}
