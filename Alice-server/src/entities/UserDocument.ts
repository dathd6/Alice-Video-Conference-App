import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Document } from "./Document";
import { User } from "./User";

@ObjectType()
@Entity()
export class UserDocument extends BaseEntity {
  @Field()
  @PrimaryColumn()
  userId!: number;

  @ManyToOne(() => User, (user) => user.documents)
  user: User;

  @Field()
  @PrimaryColumn()
  documentId!: number;

  @ManyToOne(() => Document, (document) => document.users, { eager: true })
  document: Document;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = new Date();
}
