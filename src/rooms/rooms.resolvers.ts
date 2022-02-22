import { Room } from ".prisma/client";
import { Context, Resolvers } from "../types";

const resolvers: Resolvers = {
  Room: {
    totalUnreadMessages: async (parent: Room, __: any, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<number> => {
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
  },
};

export default resolvers;
