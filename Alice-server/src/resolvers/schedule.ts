import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { Schedule } from "../entities/Schedule";
import { User } from "../entities/User";
import { UserSchedule } from "../entities/UserSchedule";
import { MyContext } from "../types";

@ObjectType()
class ScheduleValue {
  @Field()
  schedule: Schedule;
  @Field(() => [User])
  users: User[];
}

@Resolver(Schedule)
export class ScheduleResolver {
  @Mutation(() => Schedule, { nullable: true })
  async saveSchedule(
    @Arg("title") title: string,
    @Arg("dateType") dateType: string,
    @Arg("startAt") startAt: string,
    @Arg("banner") banner: string,
    @Arg("members", (_) => [Number]) members: number[],
    @Arg("description", { nullable: true }) description: string,
    @Arg("company", { nullable: true }) company: string,
    @Ctx() { req }: MyContext
  ): Promise<Schedule | undefined> {
    let schedule: any;
    try {
      schedule = await Schedule.create({
        title,
        description,
        dateType,
        startAt,
        company,
        banner,
        hostId: req.session.userId,
      }).save();
      members.map(async (member) => {
        await UserSchedule.create({
          userId: member,
          scheduleId: schedule.id,
        }).save();
      });
      await UserSchedule.create({
        userId: req.session.userId,
        scheduleId: schedule.id,
      }).save();
    } catch (err) {}
    const host = await User.findOne({
      where: {
        id: schedule.hostId,
      },
    });
    return { ...schedule, host };
  }

  @Query(() => [Schedule])
  async getSchedules(@Ctx() { req }: MyContext): Promise<Schedule[]> {
    const schedules = await UserSchedule.find({
      where: {
        userId: req.session.userId,
      },
      relations: ["schedule"],
    });

    return schedules.map(({ schedule }) => {
      return schedule;
    });
  }

  @Query(() => ScheduleValue, { nullable: true })
  async getSchedule(@Arg("id") id: number): Promise<ScheduleValue | undefined> {
    const users = await UserSchedule.find({
      where: {
        scheduleId: id,
      },
      relations: ["schedule"],
    });

    return {
      schedule: users[0].schedule,
      users: users.map(({ user }) => {
        return user;
      }),
    };
  }

  @Mutation(() => Boolean)
  async deleteSchedule(@Arg("id") id: number) {
    await Schedule.delete(id);
    return true;
  }

  @Mutation(() => Schedule)
  async updateSchedule(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Arg("dateType") dateType: string,
    @Arg("startAt") startAt: string,
    @Arg("banner") banner: string,
    @Arg("members", (_) => [Number]) members: number[],
    @Arg("description", { nullable: true }) description: string,
    @Arg("company", { nullable: true }) company: string,
    @Ctx() { req }: MyContext
  ): Promise<Schedule | undefined> {
    const userSchedule = await UserSchedule.find({
      where: {
        scheduleId: id,
      },
    });
    members.map(async (value) => {
      if (!userSchedule.find(({ userId }) => userId === value)) {
        await UserSchedule.create({
          userId: value,
          scheduleId: id,
        }).save();
      }
    });
    userSchedule.map(async ({ userId }) => {
      if (
        req.session.userId !== userId &&
        !members.find((value) => userId === value)
      ) {
        await UserSchedule.delete({ userId, scheduleId: id });
      }
    });

    await Schedule.update(id, {
      title,
      description,
      dateType,
      startAt,
      company,
      banner,
    });

    return await Schedule.findOne({
      where: {
        id,
      },
    });
  }
}
