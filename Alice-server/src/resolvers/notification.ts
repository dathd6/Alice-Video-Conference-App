import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../types";
import { Notification } from "../entities/Notification";
import { User } from "../entities/User";

@Resolver()
export class NotificationResolver {
  @Mutation(() => Notification, { nullable: true })
  async createNotification(
    @Arg("receiver") receiver: number,
    @Arg("content") content: string,
    @Arg("type") type: string,
    @Arg("isSeen") isSeen: boolean,
    @Arg("url") url: string,
    @Ctx() { req }: MyContext
  ): Promise<Notification | undefined> {
    let notification;
    try {
      notification = await Notification.create({
        content,
        receiver,
        url,
        type,
        isSeen,
        userId: req.session.userId,
      }).save();
    } catch (err) {}

    const user = await User.findOne({
      where: {
        id: req.session.userId,
      },
    });

    //@ts-ignore
    return { ...notification, user };
  }

  @Mutation(() => Boolean)
  async seenNotification(
    @Arg("id") id: number,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    if (req.session.userId) {
      await Notification.update(id, {
        isSeen: true,
      });
    }

    return true;
  }

  @Query(() => [Notification], { nullable: true })
  async notifications(@Ctx() { req }: MyContext): Promise<Notification[]> {
    const notifications = await Notification.find({
      where: {
        receiver: req.session.userId,
      },
    });
    return notifications;
  }
}
