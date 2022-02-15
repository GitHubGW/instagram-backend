import { User } from ".prisma/client";
import { Context, Resolvers } from "../types";

const resolvers: Resolvers = {
  User: {
    totalFollowing: async (parent: User, args: any, { prisma }: Context): Promise<number | null> => {
      try {
        const countedFollowing: number = await prisma.user.count({ where: { followers: { some: { username: parent.username } } } });
        return countedFollowing;
      } catch (error) {
        console.log("totalFollowing error");
        return null;
      }
    },
    totalFollowers: async (parent: User, args: any, { prisma }: Context): Promise<number | null> => {
      try {
        const countedFollowers: number = await prisma.user.count({ where: { following: { some: { username: parent.username } } } });
        return countedFollowers;
      } catch (error) {
        console.log("totalFollowers error");
        return null;
      }
    },
    isFollowing: async (parent: User, args: any, { prisma, loggedInUser }: Context): Promise<boolean> => {
      try {
        if (loggedInUser === null) {
          return false;
        }

        const countedFollowing: number = await prisma.user.count({
          where: { username: loggedInUser.username, following: { some: { username: parent.username } } },
        });

        if (countedFollowing === 0) {
          return false;
        }

        return true;
      } catch (error) {
        console.log("isFollowing error");
        return false;
      }
    },
    isMe: (parent: User, args: any, { loggedInUser }: Context): boolean => {
      if (loggedInUser === null || parent.username !== loggedInUser.username) {
        return false;
      }
      return true;
    },
  },
};

export default resolvers;
