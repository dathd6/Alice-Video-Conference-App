import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Document } from "../entities/Document";
import { MyContext } from "../types";
import { UserDocument } from "../entities/UserDocument";
import { User } from "../entities/User";
import { Transcript } from "../entities/Transcript";
import { Schedule } from "../entities/Schedule";

@InputType()
class TransInput {
  @Field()
  userId: number;
  @Field()
  context: string;
  @Field()
  type: string;
  @Field()
  startedAt: number;
}

@InputType()
class TransUpdate {
  @Field()
  id: number;
  @Field()
  context: string;
  @Field(() => Boolean, { nullable: true })
  isDelete: boolean;
}

@InputType()
export class UpdateDocumentInput {
  @Field()
  id: number;
  @Field(() => String, { nullable: true })
  title?: string;
  @Field(() => String, { nullable: true })
  logo?: string;
  @Field(() => String, { nullable: true })
  startedAt?: string;
  @Field(() => Number, { nullable: true })
  duration?: number;
  @Field(() => TransUpdate, { nullable: true })
  transcripts?: TransUpdate;
  @Field(() => String, { nullable: true })
  company?: string;
  @Field(() => String, { nullable: true })
  description?: string;
  @Field(() => Number, { nullable: true })
  scheduleId: number;
}

@InputType()
export class SaveDocumentInput {
  @Field()
  title: string;
  @Field()
  logo?: string;
  @Field()
  record?: string;
  @Field()
  scheduleId: number;
  @Field()
  recordStartedAt: number;
  @Field()
  startedAt: string;
  @Field()
  duration: number;
  @Field(() => [Number])
  members: number[];
  @Field(() => [Number])
  absents: number[];
  @Field(() => [TransInput])
  transcripts: TransInput[];
}

@ObjectType()
export class DocumentValue {
  @Field()
  document?: Document;
  // @Field(() => [UserDocumentInfo])
  // users: UserDocumentInfo[];
  @Field(() => [User])
  users: User[];
  @Field(() => [Boolean])
  isabsent: boolean[];
}

@Resolver(Document)
export class DocumentResolver {
  @Mutation(() => Number, { nullable: true })
  async saveDocument(
    @Arg("options") options: SaveDocumentInput
  ): Promise<Number | undefined> {
    let members: string = "";
    options.members.map((value) => {
      if (members === "") members = value.toString();
      else members += `-${value}`;
    });
    let absents: string = "";
    options.absents.map((value) => {
      if (absents === "") absents = value.toString();
      else absents += `-${value}`;
    });
    let document: Document | undefined;
    try {
      document = await Document.create({
        title: options.title,
        logo: options.logo,
        record: options.record,
        scheduleId: options.scheduleId,
        members: members,
        absents: absents,
        duration: options.duration,
        recordStartedAt: options.recordStartedAt,
        startedAt: options.startedAt,
      }).save();
      options.members.map(async (member) => {
        await UserDocument.create({
          userId: member,
          documentId: document?.id,
        }).save();
      });
      options.absents.map(async (member) => {
        await UserDocument.create({
          userId: member,
          documentId: document?.id,
        }).save();
      });
      options.transcripts.map(async (transcript) => {
        await Transcript.create({
          context: transcript.context,
          userId: transcript.userId,
          type: transcript.type,
          startedAt: transcript.startedAt,
          documentId: document?.id,
        }).save();
      });
    } catch (err) {}
    return document?.id;
  }

  @Mutation(() => Boolean)
  async updateDocument(
    @Arg("options") options: UpdateDocumentInput
  ): Promise<Boolean> {
    try {
      if (options.title) {
        await Document.update(options.id, {
          title: options.title,
        });
      }

      if (options.scheduleId) {
        if (options.company) {
          await Schedule.update(options.scheduleId, {
            company: options.company,
          });
        }
        if (options.description) {
          await Schedule.update(options.scheduleId, {
            description: options.description,
          });
        }
      }

      if (options.transcripts?.id) {
        if (options.transcripts?.isDelete) {
          await Transcript.delete(options.transcripts?.id);
        } else
          await Transcript.update(options.transcripts?.id, {
            context: options.transcripts?.context,
          });
      }
    } catch (err) {}
    return true;
  }

  @Query(() => [Document], { nullable: true })
  async documents(@Ctx() { req }: MyContext): Promise<Document[] | undefined> {
    if (req.session.userId) {
      const user_document = await UserDocument.find({
        where: {
          userId: req.session.userId,
        },
      });

      return user_document.map(({ document }) => {
        return document;
      });
    } else {
      return undefined;
    }
  }

  @Query(() => DocumentValue, { nullable: true })
  async document(
    @Arg("id") id: number,
    @Ctx() { req }: MyContext
  ): Promise<DocumentValue | undefined> {
    if (req.session.userId) {
      const document = await UserDocument.findOne({
        where: {
          documentId: id,
          userId: req.session.userId,
        },
      });

      // const result: UserDocumentInfo[] = [];
      let users: User[] = [];
      let isabsent: boolean[] = [];

      return {
        document: document?.document,
        users,
        isabsent,
      };
    } else {
      return undefined;
    }
  }
}
