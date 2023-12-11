// eslint-disable-next-line hexagonal-architecture/enforce
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableUserAddColumnUsername1702323237469
  implements MigrationInterface
{
  name = 'AlterTableUserAddColumnUsername1702323237469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "username" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "username"`);
  }
}
