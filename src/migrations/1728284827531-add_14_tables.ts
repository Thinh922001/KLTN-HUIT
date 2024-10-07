import { MigrationInterface, QueryRunner } from "typeorm";

export class Add14Tables1728284827531 implements MigrationInterface {
    name = 'Add14Tables1728284827531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`labels\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`text\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, \`type\` tinyint UNSIGNED NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`label_product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`label_id\` int NOT NULL, \`product_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`brand\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`name\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`gift\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`gift_name\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, \`description\` text CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL, \`value\` decimal(10,2) NULL, \`sku_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`price\` decimal(10,2) NOT NULL, \`discount_percent\` decimal(5,2) NOT NULL DEFAULT '0.00', \`old_price\` decimal(10,2) NOT NULL, \`product_name\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL, \`img\` varchar(255) NULL, \`text_online_type\` text NULL, \`tabs\` text NULL, \`variants\` json NULL, \`total_vote\` int UNSIGNED NOT NULL DEFAULT '0', \`start_rate\` decimal(2,1) UNSIGNED NOT NULL DEFAULT '0.0', \`brand_id\` int NOT NULL, \`cate_id\` int NOT NULL, INDEX \`IDX_894a8151f2433fca9b81acb297\` (\`product_name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_details_img\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`img\` varchar(255) NULL, \`product_details_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`price\` decimal(10,2) NOT NULL, \`discount_percent\` decimal(5,2) NOT NULL DEFAULT '0.00', \`old_price\` decimal(10,2) NOT NULL, \`sku_code\` varchar(50) NOT NULL, \` variation_details\` json NULL, \`stock\` int UNSIGNED NOT NULL DEFAULT '0', \`product_id\` int NOT NULL, UNIQUE INDEX \`IDX_f1c7e654d6165528f3fc53d2ba\` (\`sku_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`quantity\` int NOT NULL DEFAULT '0', \`unit_price\` decimal(10,2) NOT NULL DEFAULT '0.00', \`total_price\` decimal(15,2) NOT NULL, \`order_id\` int NOT NULL, \`product_detail_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Invoice\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`total_amount\` decimal(15,2) NOT NULL, \`status\` varchar(50) NOT NULL DEFAULT 'Unpaid', \`payment_method\` varchar(50) NULL, \`order_id\` int NOT NULL, \`customer_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`coupon\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`code\` varchar(100) NOT NULL, \`discount_value\` decimal(10,2) NOT NULL, \`discount_type\` varchar(50) NOT NULL, \`expiration_date\` datetime NULL, \`is_active\` tinyint NOT NULL DEFAULT 1, \`usage_limit\` int NULL, \`times_used\` int NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_62d3c5b0ce63a82c48e86d904b\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`status\` varchar(50) NOT NULL DEFAULT 'Pending', \`total_amount\` decimal(15,2) NOT NULL, \`shipping_method\` varchar(100) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL, \`shipping_address\` text CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL, \`note\` text NULL, \`customer_id\` int NOT NULL, \`coupon_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`customer_id\` int NOT NULL, \`total_price\` decimal(15,2) NOT NULL DEFAULT '0.00', \`expiration_date\` datetime NULL, UNIQUE INDEX \`REL_242205c81c1152fab1b6e84847\` (\`customer_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart_item\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`quantity\` int NOT NULL, \`unit_price\` decimal(10,2) NOT NULL, \`total_price\` decimal(15,2) NOT NULL, \`cart_id\` int NOT NULL, \`sku_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`sns_type\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`name\` varchar(255) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`address\` varchar(500) CHARACTER SET "utf8mb4" COLLATE "utf8mb4_unicode_ci" NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_a000cca60bcf04454e72769949\` (\`phone\`)`);
        await queryRunner.query(`ALTER TABLE \`label_product\` ADD CONSTRAINT \`FK_6d05b95a9feb8e90169f44d6600\` FOREIGN KEY (\`label_id\`) REFERENCES \`labels\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`label_product\` ADD CONSTRAINT \`FK_8445980bb75f47fbc31cb76f67d\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`gift\` ADD CONSTRAINT \`FK_953bd0c2e6d871902610ed60060\` FOREIGN KEY (\`sku_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_1530a6f15d3c79d1b70be98f2be\` FOREIGN KEY (\`brand_id\`) REFERENCES \`brand\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_578ab2d57711b8e73f14a78e3cf\` FOREIGN KEY (\`cate_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_details_img\` ADD CONSTRAINT \`FK_7167d9d2c0ba6e1855afd3b9bf7\` FOREIGN KEY (\`product_details_id\`) REFERENCES \`product_details\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_details\` ADD CONSTRAINT \`FK_abbb591b1989c63fb0c240dfffb\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_3ff3367344edec5de2355a562ee\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_d9a45fe5932c3713ecb5ca2818d\` FOREIGN KEY (\`product_detail_id\`) REFERENCES \`product_details\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Invoice\` ADD CONSTRAINT \`FK_35acd5b55e6d8bb198bb2b18810\` FOREIGN KEY (\`order_id\`) REFERENCES \`order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`Invoice\` ADD CONSTRAINT \`FK_382d4ca5c26c60b98de6adf7434\` FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_cd7812c96209c5bdd48a6b858b0\` FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_baced9282892a60354aaa789fb4\` FOREIGN KEY (\`coupon_id\`) REFERENCES \`coupon\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD CONSTRAINT \`FK_242205c81c1152fab1b6e848470\` FOREIGN KEY (\`customer_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_b6b2a4f1f533d89d218e70db941\` FOREIGN KEY (\`cart_id\`) REFERENCES \`cart\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart_item\` ADD CONSTRAINT \`FK_b352a674ef54c58b35c2c56448d\` FOREIGN KEY (\`sku_id\`) REFERENCES \`product_details\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_b352a674ef54c58b35c2c56448d\``);
        await queryRunner.query(`ALTER TABLE \`cart_item\` DROP FOREIGN KEY \`FK_b6b2a4f1f533d89d218e70db941\``);
        await queryRunner.query(`ALTER TABLE \`cart\` DROP FOREIGN KEY \`FK_242205c81c1152fab1b6e848470\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_baced9282892a60354aaa789fb4\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_cd7812c96209c5bdd48a6b858b0\``);
        await queryRunner.query(`ALTER TABLE \`Invoice\` DROP FOREIGN KEY \`FK_382d4ca5c26c60b98de6adf7434\``);
        await queryRunner.query(`ALTER TABLE \`Invoice\` DROP FOREIGN KEY \`FK_35acd5b55e6d8bb198bb2b18810\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_d9a45fe5932c3713ecb5ca2818d\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_3ff3367344edec5de2355a562ee\``);
        await queryRunner.query(`ALTER TABLE \`product_details\` DROP FOREIGN KEY \`FK_abbb591b1989c63fb0c240dfffb\``);
        await queryRunner.query(`ALTER TABLE \`product_details_img\` DROP FOREIGN KEY \`FK_7167d9d2c0ba6e1855afd3b9bf7\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_578ab2d57711b8e73f14a78e3cf\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_1530a6f15d3c79d1b70be98f2be\``);
        await queryRunner.query(`ALTER TABLE \`gift\` DROP FOREIGN KEY \`FK_953bd0c2e6d871902610ed60060\``);
        await queryRunner.query(`ALTER TABLE \`label_product\` DROP FOREIGN KEY \`FK_8445980bb75f47fbc31cb76f67d\``);
        await queryRunner.query(`ALTER TABLE \`label_product\` DROP FOREIGN KEY \`FK_6d05b95a9feb8e90169f44d6600\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_a000cca60bcf04454e72769949\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`phone\` \`phone\` varchar(255) CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`address\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`sns_type\` enum CHARACTER SET "latin1" COLLATE "latin1_swedish_ci" ('1', '2', '3', '4') NULL`);
        await queryRunner.query(`DROP TABLE \`cart_item\``);
        await queryRunner.query(`DROP INDEX \`REL_242205c81c1152fab1b6e84847\` ON \`cart\``);
        await queryRunner.query(`DROP TABLE \`cart\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP INDEX \`IDX_62d3c5b0ce63a82c48e86d904b\` ON \`coupon\``);
        await queryRunner.query(`DROP TABLE \`coupon\``);
        await queryRunner.query(`DROP TABLE \`Invoice\``);
        await queryRunner.query(`DROP TABLE \`order_details\``);
        await queryRunner.query(`DROP INDEX \`IDX_f1c7e654d6165528f3fc53d2ba\` ON \`product_details\``);
        await queryRunner.query(`DROP TABLE \`product_details\``);
        await queryRunner.query(`DROP TABLE \`product_details_img\``);
        await queryRunner.query(`DROP INDEX \`IDX_894a8151f2433fca9b81acb297\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP TABLE \`gift\``);
        await queryRunner.query(`DROP TABLE \`categories\``);
        await queryRunner.query(`DROP TABLE \`brand\``);
        await queryRunner.query(`DROP TABLE \`label_product\``);
        await queryRunner.query(`DROP TABLE \`labels\``);
    }

}
