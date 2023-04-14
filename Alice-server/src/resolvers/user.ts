import { User } from "../entities/User";
import { MyContext } from "src/types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import argon2 from "argon2";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "../constances";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister } from "../utils/validateRegister";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";
import { getConnection } from "typeorm";
import { Relationship } from "../entities/Relationship";
import { UserSchedule } from "../entities/UserSchedule";
// import { getConnection } from "typeorm";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
class UserInfo {
  @Field()
  id: number;
  @Field(() => User)
  user: User;
  @Field(() => String, { nullable: true })
  relationship?: string;
}

@ObjectType()
class UserDocumentInfo {
  @Field(() => User)
  user?: User;
  @Field(() => Boolean)
  isAbsent: boolean;
}

@InputType()
export class GetUserDocumentInput {
  @Field(() => [Number])
  members: number[];
  @Field(() => [Number])
  absents: number[];
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    if (req.session.userId === user.id) {
      return user.email;
    }
    return "";
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ) {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }
    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const user = await User.findOne(parseInt(userId));

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer existed",
          },
        ],
      };
    }

    await User.update(
      { id: parseInt(userId) },
      {
        password: await argon2.hash(newPassword),
      }
    );

    await redis.del(key);

    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return true;
    }
    const token = v4();
    const html = `<a href="http://localhost:3000/change-password/${token}">reset password</a>`;
    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60
    );
    await sendEmail(email, html);
    return true;
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    return User.findOne(req.session.userId);
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    console.log(options);
    const errors = validateRegister(options);
    console.log(errors);
    if (errors) {
      return { errors };
    }
    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      user = await User.create({
        username: options.username,
        password: hashedPassword,
        email: options.email,
        fullname: options.fullName,
      }).save();
      // const result = await getConnection()
      //   .createQueryBuilder()
      //   .insert()
      //   .into(User)
      //   .values({
      //     username: options.username,
      //     password: hashedPassword,
      //     email: options.email,
      //   })
      //   .returning("*")
      //   .execute();
      // user = result.raw;
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }
    req.session.userId = user?.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? {
            where: { email: usernameOrEmail },
          }
        : {
            where: { username: usernameOrEmail },
          }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "that username/email doesn't exist",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err: any) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }

  @Query(() => [UserInfo])
  async relationships(@Arg("id") id: number) {
    const relation1 = await Relationship.find({
      where: { userId1: id },
    });
    const relation2 = await Relationship.find({
      where: { userId2: id },
    });
    const relation = [...relation1, ...relation2];

    const result = await Promise.all(
      relation.map(async ({ userId1, userId2, type }): Promise<User> => {
        const userId = id === userId1 ? userId2 : userId1;

        let user = await User.findOne({
          where: {
            id: userId,
          },
        });

        return {
          //@ts-ignore
          id: user.id,
          //@ts-ignore
          user,
          relationship: type,
        };
      })
    );

    return result;
  }

  @Mutation(() => User, { nullable: true })
  async updateInfo(
    @Arg("banner", { nullable: true }) banner: string,
    @Arg("avatar", { nullable: true }) avatar: string,
    @Arg("fullname", { nullable: true }) fullname: string,
    @Arg("email", { nullable: true }) email: string,
    @Arg("username", { nullable: true }) username: string,
    @Arg("timeSpend", { nullable: true }) timeSpend: number,
    @Arg("joined", { nullable: true }) joined: number,
    @Arg("cancel", { nullable: true }) cancel: number,
    @Arg("document", { nullable: true }) document: number,
    @Ctx() { req }: MyContext
  ) {
    if (!req.session.userId) return null;
    if (avatar) {
      await User.update(
        { id: req.session.userId },
        {
          avatar,
        }
      );
    }
    if (banner) {
      await User.update(
        { id: req.session.userId },
        {
          banner,
        }
      );
    }
    if (timeSpend) {
      await User.update(
        { id: req.session.userId },
        {
          timeSpend,
        }
      );
    }
    if (joined) {
      await User.update(
        { id: req.session.userId },
        {
          joined,
        }
      );
    }
    if (cancel) {
      await User.update(
        { id: req.session.userId },
        {
          cancel,
        }
      );
    }
    if (document) {
      await User.update(
        { id: req.session.userId },
        {
          document,
        }
      );
    }
    if (fullname && email && username) {
      try {
        await User.update(
          { id: req.session.userId },
          {
            fullname,
            email,
            username,
          }
        );
      } catch (err) {
        console.log(err);
      }
    }

    return User.findOne({
      where: {
        id: req.session.userId,
      },
    });
  }

  @Query(() => [UserInfo])
  async searchUser(
    @Arg("search") search: string,
    @Arg("friend", { nullable: true }) friend: boolean,
    @Ctx() { req }: MyContext
  ) {
    const users = await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.fullname like :search OR user.username like :search", {
        search: `%${search}%`,
      })
      .getMany();

    const result = await Promise.all(
      users.map(async (user): Promise<UserInfo> => {
        if (!req.session.userId)
          return {
            id: user.id,
            user,
          };

        const userId1 =
          req.session.userId < user.id ? req.session.userId : user.id;
        const userId2 =
          req.session.userId < user.id ? user.id : req.session.userId;
        let relationship;

        try {
          relationship = await Relationship.findOne({
            where: {
              userId1,
              userId2,
            },
          });
        } catch (err) {
          relationship = null;
        }

        return {
          id: user.id,
          user,
          relationship: relationship?.type,
        };
      })
    );

    if (friend) {
      return result.filter((user) => {
        return user.relationship === "follow";
      });
    }

    return result;
  }

  @Query(() => UserInfo, { nullable: true })
  async getUserById(
    @Arg("id") id: number,
    @Ctx() { req }: MyContext
  ): Promise<UserInfo | undefined> {
    const user = await User.findOne(id);
    if (!user) return undefined;
    if (!req.session.userId) return { id: user.id, user };
    else {
      const userId1 = req.session.userId < id ? req.session.userId : id;
      const userId2 = req.session.userId < id ? id : req.session.userId;
      let relationship;
      try {
        relationship = await Relationship.findOne({
          where: {
            userId1,
            userId2,
          },
        });
      } catch (err) {
        relationship = null;
      }

      return { id: user.id, user, relationship: relationship?.type };
    }
    // return user;
  }

  @Query(() => [User])
  async getUserFromSchedule(@Arg("scheduleId") scheduleId: number) {
    if (scheduleId) {
      const users = await UserSchedule.find({
        where: {
          scheduleId,
        },
        relations: ["schedule"],
      });
      return users.map(({ user }) => {
        return user;
      });
    } else return [];
  }

  @Query(() => [UserDocumentInfo])
  async getUserDocument(@Arg("options") options: GetUserDocumentInput) {
    return [
      ...options.members.map(async (id) => {
        const user = await User.findOne({
          where: {
            id,
          },
        });
        console.log(user);
        return {
          isAbsent: false,
          user,
        };
      }),
      ...options.absents.map(async (id) => {
        const user = await User.findOne({
          where: {
            id,
          },
        });
        return {
          isAbsent: true,
          user,
        };
      }),
    ];
  }
}
