import { MigrationInterface, QueryRunner } from "typeorm";

export class Create1762231164869 implements MigrationInterface {
    name = 'Create1762231164869'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mail_record\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`bgInfo\``);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`bgInfo\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`mail_record\` CHANGE \`to_emails\` \`to_emails\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`mail_record\` CHANGE \`cc_emails\` \`cc_emails\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`mail_record\` CHANGE \`bcc_emails\` \`bcc_emails\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`mail_record\` CHANGE \`message\` \`message\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`mail_record\` ADD UNIQUE INDEX \`IDX_38abf7ebf6d05351938d77fa28\` (\`tracking_id\`)`);
        await queryRunner.query(`ALTER TABLE \`mail_event\` DROP FOREIGN KEY \`FK_f40e573187942c1b6eddb931214\``);
        await queryRunner.query(`ALTER TABLE \`mail_event\` CHANGE \`form_id\` \`form_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`mail_event\` ADD CONSTRAINT \`FK_f40e573187942c1b6eddb931214\` FOREIGN KEY (\`form_id\`) REFERENCES \`mail_record\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`mail_event\` DROP FOREIGN KEY \`FK_f40e573187942c1b6eddb931214\``);
        await queryRunner.query(`ALTER TABLE \`mail_event\` CHANGE \`form_id\` \`form_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mail_event\` ADD CONSTRAINT \`FK_f40e573187942c1b6eddb931214\` FOREIGN KEY (\`form_id\`) REFERENCES \`mail_record\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`mail_record\` DROP INDEX \`IDX_38abf7ebf6d05351938d77fa28\``);
        await queryRunner.query(`ALTER TABLE \`mail_record\` CHANGE \`message\` \`message\` text NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`mail_record\` CHANGE \`bcc_emails\` \`bcc_emails\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`mail_record\` CHANGE \`cc_emails\` \`cc_emails\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`mail_record\` CHANGE \`to_emails\` \`to_emails\` varchar(255) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`employee\` DROP COLUMN \`bgInfo\``);
        await queryRunner.query(`ALTER TABLE \`employee\` ADD \`bgInfo\` longtext COLLATE "utf8mb4_bin" NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`mail_record\` DROP COLUMN \`created_at\``);
    }

}
