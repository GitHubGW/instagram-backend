import prisma from "../../prisma";
import pubsub from "../../pubsub";
import { withFilter } from "graphql-subscriptions";
import { Message } from ".prisma/client";
import { User } from ".prisma/client";
import { Room } from ".prisma/client";

interface MessageUpdatesPayload {
  messageUpdates: Message;
}

interface MessageUpdatesArgs {
  roomId: number;
}

interface MessageUpdatesContext {
  loggedInUser?: User;
}

const resolvers = {
  Subscription: {
    messageUpdates: {
      subscribe: async (parent: any, args: MessageUpdatesArgs, context: MessageUpdatesContext, info: any) => {
        const foundRoom: Room | null = await prisma.room.findFirst({
          where: { id: args.roomId, users: { some: { id: context.loggedInUser?.id } } },
        });

        if (foundRoom === null) {
          throw new Error("존재하지 않거나 구독할 수 없는 채팅방입니다.");
        }

        return withFilter(
          () => pubsub.asyncIterator(["MESSAGE_UPDATES"]),
          (payload: MessageUpdatesPayload, args: MessageUpdatesArgs): boolean => {
            if (payload.messageUpdates.roomId !== args.roomId) {
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
