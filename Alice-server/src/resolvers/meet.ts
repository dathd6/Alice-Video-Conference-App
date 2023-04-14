import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { v4 } from "uuid";
import { MyContext } from "../types";

@Resolver()
export class MeetResolver {
  @Mutation(() => String)
  createMeeting(@Ctx() { req }: MyContext) {
    const code = v4();
    if (!req.session.meeting) req.session.meeting = [code];
    else req.session.meeting = [code, ...req.session.meeting];
    return code;
  }

  @Mutation(() => Boolean)
  eraseMeeting(@Arg("code") code: string, @Ctx() { req }: MyContext) {
    if (req.session.meeting) {
      req.session.meeting = req.session.meeting.filter((meet: any) => {
        return meet !== code;
      });
    }

    return true;
  }
}
