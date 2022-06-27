import { Message, Room } from ".prisma/client";
import { Context, Resolvers } from "../types";

const resolvers: Resolvers = {
  Room: {
    totalUnreadMessages: async (parent: Room, __, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<number> => {
      try {
        handleCheckLogin(loggedInUser);
        const countedMessages: number = await prisma.message.count({
          where: {
            read: false,
            roomId: parent.id,
            NOT: { userId: loggedInUser?.id },
          },
        });
        return countedMessages;
      } catch (error) {
        console.log("totalUnreadMessages error");
        return 0;
      }
    },
    latestMessage: async (parent: Room, __, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<Message | null> => {
      try {
        handleCheckLogin(loggedInUser);
        const latestMessage: Message | null = await prisma.message.findFirst({
          where: { roomId: parent.id },
          orderBy: { createdAt: "desc" },
        });
        return latestMessage;
      } catch (error) {
        console.log("latestMessage error");
        return null;
      }
    },
  },
};

export default resolvers;
