import { MigrationInterface, QueryRunner } from "typeorm";

export class RelationshipV21619781064584 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        insert into public.relationship ("userId2", "userId1", type) values (51, 4, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 6, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 12, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 33, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 29, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 47, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 10, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 15, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 40, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 38, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 35, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 17, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 16, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 24, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 43, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 9, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 13, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 26, 'follow');
    insert into public.relationship ("userId2", "userId1", type) values (51, 18, 'follow');
    `);
  }
  public async down(_: QueryRunner): Promise<void> {}
}
