import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Schedule } from "./Schedule";
import { Transcript } from "./Transcript";
import { UserDocument } from "./UserDocument";

@ObjectType()
@Entity()
export class Document extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column({
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbCRmiC1UVZU50dPMqXNSRqTjcTxAOwu2CJADaOEuu-xOsrjh01WODSyZD_95OplBCrFk&usqp=CAU",
  })
  logo: string;

  @Field()
  @Column({ default: "https://vjs.zencdn.net/v/oceans.mp4" })
  record: string;

  @Field()
  @Column()
  recordStartedAt: number;

  @Field(() => [Transcript])
  @OneToMany(() => Transcript, (transcript) => transcript.document, {
    eager: true,
  })
  transcripts: Transcript[];

  @Field()
  @Column({ default: "" })
  moreInfo: string;

  @Field()
  @Column()
  startedAt!: string;

  @Field()
  @Column()
  duration!: number;

  @Field()
  @Column()
  members: string;

  @Field()
  @Column()
  absents: string;

  @Field()
  @Column()
  scheduleId: number;

  @Field(() => Schedule)
  @ManyToOne(() => Schedule, (schedule) => schedule.documents, { eager: true })
  schedule: Schedule;

  @OneToMany(() => UserDocument, (user) => user.document)
  users: UserDocument[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = new Date();
}
