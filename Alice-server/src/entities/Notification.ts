import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { User } from "./User";

@ObjectType()
@Entity()
export class Notification extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  content!: string;

  @Field()
  @Column()
  type!: string;

  @Field()
  @Column()
  isSeen: boolean;

  @Column()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.notifications, { eager: true })
  user: User;

  @Field()
  @Column()
  url: string;

  @Field()
  @Column()
  receiver: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = new Date();
}
