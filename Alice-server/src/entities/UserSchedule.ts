import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Schedule } from "./Schedule";
import { User } from "./User";

@ObjectType()
@Entity()
export class UserSchedule extends BaseEntity {
  @Field()
  @PrimaryColumn()
  userId!: number;

  @Field()
  @PrimaryColumn()
  scheduleId!: number;

  @ManyToOne(() => User, (user) => user.schedules, { eager: true })
  user: User;

  @ManyToOne(() => Schedule, (schedule) => schedule.users, {
    onDelete: "CASCADE",
  })
  schedule: Schedule;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = new Date();
}
