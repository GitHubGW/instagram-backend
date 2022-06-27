import prisma from "../../prisma";
import pubsub from "../../pubsub";
import { User } from ".prisma/client";
import { withFilter } from "graphql-subscriptions";

interface FollowUpdatesPayload {
  followUpdates: User;
}

interface FollowUpdatesArgs {
  userId: number;
}

interface FollowUpdatesContext {
  loggedInUser?: User;
}

const resolvers = {
  Subscription: {
    followUpdates: {
      subscribe: async (parent: any, args: FollowUpdatesArgs, context: FollowUpdatesContext, info: any) => {
        const foundUser: User | null = await prisma.user.findFirst({
          where: { id: args.userId, username: context.loggedInUser?.username },
        });

        if (foundUser === null) {
          throw new Error("존재하지 않거나 구독할 수 없는 유저입니다.");
        }

        return withFilter(
          () => pubsub.asyncIterator(["FOLLOW_UPDATES"]),
          (payload: FollowUpdatesPayload, args: FollowUpdatesArgs): boolean => {
            if (payload.followUpdates.id === args.userId) {
              return false;
            }
            return true;
          }
        )(parent, args, context, info);
      },
    },
  },
};

export default resolvers;
