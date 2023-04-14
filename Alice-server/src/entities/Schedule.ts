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
import { User } from "./User";
import { UserSchedule } from "./UserSchedule";
import { Document } from "./Document";

@ObjectType()
@Entity()
export class Schedule extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  dateType!: string;

  @Field()
  @Column()
  startAt: string;

  @Field()
  @Column()
  hostId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.hostMeeting, { eager: true })
  host: User;

  @OneToMany(() => Document, (document) => document.schedule)
  documents: Document[];

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  banner: string;

  @Field()
  @Column()
  company: string;

  @OneToMany(() => UserSchedule, (user) => user.schedule, {
    cascade: true,
  })
  @Field(() => [UserSchedule])
  users: UserSchedule[];

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = new Date();
}
