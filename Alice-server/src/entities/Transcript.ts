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
import { Document } from "./Document";
import { User } from "./User";

@ObjectType()
@Entity()
export class Transcript extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  context: string;

  @Field()
  @Column()
  type: string;

  @Field()
  @Column()
  userId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.transcripts, { eager: true })
  user: User;

  @Field()
  @Column()
  documentId: number;

  @ManyToOne(() => Document, (document) => document.transcripts)
  document: Document;

  @Field()
  @Column()
  startedAt: number;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = new Date();
}
