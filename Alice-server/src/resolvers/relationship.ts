import { Arg, Mutation, Resolver } from "type-graphql";
import { Relationship } from "../entities/Relationship";

@Resolver(Relationship)
export class RelationshipResolver {
  @Mutation(() => Boolean)
  async follow(
    @Arg("sender") sender: number,
    @Arg("receiver") receiver: number
  ): Promise<Boolean> {
    const userId1 = sender < receiver ? sender : receiver;
    const userId2 = sender < receiver ? receiver : sender;

    let relationship;
    try {
      relationship = await Relationship.create({
        userId1,
        userId2,
        type: `${sender}`,
      }).save();
    } catch (err) {
      console.log(err);
      relationship = null;
    }

    if (relationship) return true;
    else return false;
  }

  @Mutation(() => Boolean)
  async accept(
    @Arg("sender") sender: number,
    @Arg("receiver") receiver: number
  ): Promise<Boolean> {
    const userId1 = sender < receiver ? sender : receiver;
    const userId2 = sender < receiver ? receiver : sender;

    await Relationship.update(
      { userId1, userId2 },
      {
        type: "follow",
      }
    );

    return true;
  }

  @Mutation(() => Boolean)
  async unfollow(
    @Arg("sender") sender: number,
    @Arg("receiver") receiver: number
  ): Promise<boolean> {
    const userId1 = sender < receiver ? sender : receiver;
    const userId2 = sender < receiver ? receiver : sender;

    await Relationship.delete({
      userId1,
      userId2,
    });

    return true;
  }
}
