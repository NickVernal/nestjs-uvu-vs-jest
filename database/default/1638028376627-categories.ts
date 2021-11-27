import { MigrationInterface, QueryRunner } from 'typeorm';

export class categories1638028376627 implements MigrationInterface {
  name = 'categories1638028376627';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "slug" character varying NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying NOT NULL DEFAULT '',
                CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"),
                CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "categories"
        `);
  }
}
