import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Schedule } from "./Schedule";
import { UserSchedule } from "./UserSchedule";
import { Transcript } from "./Transcript";
import { UserDocument } from "./UserDocument";
import { Notification } from "./Notification";
import { Message } from "./Message";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column()
  fullname!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column({
    default:
      "https://st.gamevui.com/images/image/2020/09/17/AmongUs-Avatar-maker-hd01.jpg",
  })
  avatar: string;

  @Field()
  @Column({
    default:
      "http://www.innersloth.com/Images/GAMES/AmongUs/banner_AmongUs.jpg",
  })
  banner: string;

  @Field()
  @Column({ default: 0 })
  timeSpend: number;

  @Field()
  @Column({ default: 0 })
  joined: number;

  @Field()
  @Column({ default: 0 })
  cancel: number;

  @Field()
  @Column({ default: 0 })
  document: number;

  @Column()
  password!: string;

  @OneToMany(() => Schedule, (schedule) => schedule.host)
  hostMeeting: Schedule[];

  @OneToMany(() => UserSchedule, (schedule) => schedule.user)
  schedules: UserSchedule[];

  @OneToMany(() => Transcript, (transcript) => transcript.user)
  transcripts: Transcript[];

  @OneToMany(() => UserDocument, (document) => document.user)
  documents: UserDocument[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];

  // @OneToMany(() => Chat, (chat) => chat.user)
  // chats: Chat[];

  // @OneToMany(() => Schedule, (schedule) => schedule.host)
  // meetHost: Schedule[];
  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => Date)
  @UpdateDateColumn()
  updatedAt = new Date();
}
