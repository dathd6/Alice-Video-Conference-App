import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Relationship extends BaseEntity {
  @Field()
  @Column()
  type!: string;

  @Field()
  @PrimaryColumn()
  userId1!: number;

  @Field()
  @PrimaryColumn()
  userId2!: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = new Date();
}
