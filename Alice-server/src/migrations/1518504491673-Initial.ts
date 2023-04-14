import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1518504491673 implements MigrationInterface {
  name = "Initial1518504491673";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_schedule" ("userId" integer NOT NULL, "scheduleId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3c426a0c5691a2a9d7b332adb63" PRIMARY KEY ("userId", "scheduleId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "transcript" ("id" SERIAL NOT NULL, "context" character varying NOT NULL, "type" character varying NOT NULL, "userId" integer NOT NULL, "documentId" integer NOT NULL, "startedAt" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b5b7a9bdb53103727ced1eec10e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_document" ("userId" integer NOT NULL, "documentId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f26b5b23fabec32acafa923fd79" PRIMARY KEY ("userId", "documentId"))`
    );
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "type" character varying NOT NULL, "isSeen" boolean NOT NULL, "userId" integer NOT NULL, "url" character varying NOT NULL, "receiver" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" SERIAL NOT NULL, "context" character varying NOT NULL, "type" character varying NOT NULL, "userId" integer NOT NULL, "room" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "fullname" character varying NOT NULL, "email" character varying NOT NULL, "avatar" character varying NOT NULL DEFAULT 'https://st.gamevui.com/images/image/2020/09/17/AmongUs-Avatar-maker-hd01.jpg', "banner" character varying NOT NULL DEFAULT 'http://www.innersloth.com/Images/GAMES/AmongUs/banner_AmongUs.jpg', "timeSpend" integer NOT NULL DEFAULT '0', "joined" integer NOT NULL DEFAULT '0', "cancel" integer NOT NULL DEFAULT '0', "document" integer NOT NULL DEFAULT '0', "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "schedule" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "dateType" character varying NOT NULL, "startAt" character varying NOT NULL, "hostId" integer NOT NULL, "description" character varying NOT NULL, "banner" character varying NOT NULL, "company" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1c05e42aec7371641193e180046" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "document" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "logo" character varying NOT NULL DEFAULT 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbCRmiC1UVZU50dPMqXNSRqTjcTxAOwu2CJADaOEuu-xOsrjh01WODSyZD_95OplBCrFk&usqp=CAU', "record" character varying NOT NULL DEFAULT 'https://vjs.zencdn.net/v/oceans.mp4', "recordStartedAt" integer NOT NULL, "moreInfo" character varying NOT NULL DEFAULT '', "startedAt" character varying NOT NULL, "duration" integer NOT NULL, "members" character varying NOT NULL, "absents" character varying NOT NULL, "scheduleId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "relationship" ("type" character varying NOT NULL, "userId1" integer NOT NULL, "userId2" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_9f949e132003a5d3d96d1ada920" PRIMARY KEY ("userId1", "userId2"))`
    );
    await queryRunner.query(
      `ALTER TABLE "user_schedule" ADD CONSTRAINT "FK_e934c0e0a6f68f200292ba41e1d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_schedule" ADD CONSTRAINT "FK_1dde4211ced4d915b1164d47b21" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transcript" ADD CONSTRAINT "FK_23053f5805b16589590b79c5625" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "transcript" ADD CONSTRAINT "FK_57e61da1d761efadc4543de2ba8" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_document" ADD CONSTRAINT "FK_bea6ff5b6ea0d461a438a2e837c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_document" ADD CONSTRAINT "FK_fc84ec8f7bda6539991a0d859f8" FOREIGN KEY ("documentId") REFERENCES "document"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "schedule" ADD CONSTRAINT "FK_717edf70f293d62a1dacfdeebe4" FOREIGN KEY ("hostId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "FK_cd25b98290d79a5baf5c3dcae8a" FOREIGN KEY ("scheduleId") REFERENCES "schedule"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "FK_cd25b98290d79a5baf5c3dcae8a"`
    );
    await queryRunner.query(
      `ALTER TABLE "schedule" DROP CONSTRAINT "FK_717edf70f293d62a1dacfdeebe4"`
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_document" DROP CONSTRAINT "FK_fc84ec8f7bda6539991a0d859f8"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_document" DROP CONSTRAINT "FK_bea6ff5b6ea0d461a438a2e837c"`
    );
    await queryRunner.query(
      `ALTER TABLE "transcript" DROP CONSTRAINT "FK_57e61da1d761efadc4543de2ba8"`
    );
    await queryRunner.query(
      `ALTER TABLE "transcript" DROP CONSTRAINT "FK_23053f5805b16589590b79c5625"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_schedule" DROP CONSTRAINT "FK_1dde4211ced4d915b1164d47b21"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_schedule" DROP CONSTRAINT "FK_e934c0e0a6f68f200292ba41e1d"`
    );
    await queryRunner.query(`DROP TABLE "relationship"`);
    await queryRunner.query(`DROP TABLE "document"`);
    await queryRunner.query(`DROP TABLE "schedule"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "notification"`);
    await queryRunner.query(`DROP TABLE "user_document"`);
    await queryRunner.query(`DROP TABLE "transcript"`);
    await queryRunner.query(`DROP TABLE "user_schedule"`);
  }
}
