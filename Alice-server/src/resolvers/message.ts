import { Arg, Field, InputType, Mutation, Query, Resolver } from "type-graphql";
import { Document } from "../entities/Document";
import { Message } from "../entities/Message";
import { User } from "../entities/User";

@InputType()
export class MessageInput {
  @Field()
  context: string;
  @Field()
  type: string;
  @Field()
  userId: number;
  @Field()
  room: string;
}

@Resolver(Document)
export class MessageResolver {
  @Mutation(() => Message)
  async chat(@Arg("options") options: MessageInput) {
    console.log("haha");
    let message = await Message.create({
      context: options.context,
      userId: options.userId,
      room: options.room,
      type: options.type,
    }).save();
    let user = await User.findOne({
      where: {
        id: options.userId,
      },
    });

    return { ...message, user };
  }
  @Mutation(() => Boolean)
  async updateMessage(@Arg("id") id: number, @Arg("context") context: string) {
    await Message.update(id, {
      context,
    });
    return true;
  }
  @Mutation(() => Boolean)
  async deleteMessage(@Arg("id") id: number) {
    await Message.delete(id);
    return true;
  }

  @Query(() => [Message], { nullable: true })
  async messages(@Arg("room") room: string) {
    return await Message.find({
      where: {
        room,
      },
    });
  }
}
