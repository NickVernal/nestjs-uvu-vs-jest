import { MigrationInterface, QueryRunner } from 'typeorm';

export class categoriesFieldAdd1638094968097 implements MigrationInterface {
  name = 'categoriesFieldAdd1638094968097';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "categories"
            ADD "canDoMagic" boolean NOT NULL DEFAULT true
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "categories" DROP COLUMN "canDoMagic"
        `);
  }
}
