import { Photo, User } from ".prisma/client";
import { Context, Resolvers } from "../types";

interface UsersPhotosArgs {
  cursor?: number;
}

const resolvers: Resolvers = {
  User: {
    photos: async (parent: User, { cursor }: UsersPhotosArgs, { prisma, loggedInUser }: Context): Promise<Photo[] | null> => {
      try {
        const foundPhotos: Photo[] = await prisma.user.findUnique({ where: { id: loggedInUser?.id } }).photos({
          cursor: cursor === undefined ? undefined : { id: cursor },
          skip: cursor === undefined ? 0 : 1,
          take: 9,
        });
        return foundPhotos;
      } catch (error) {
        console.log("photos error");
        return null;
      }
    },
    totalFollowing: async (parent: User, args: any, { prisma }: Context): Promise<number | null> => {
      try {
        const countedFollowing: number = await prisma.user.count({ where: { followers: { some: { id: parent.id } } } });
        return countedFollowing;
      } catch (error) {
        console.log("totalFollowing error");
        return null;
      }
    },
    totalFollowers: async (parent: User, args: any, { prisma }: Context): Promise<number | null> => {
      try {
        const countedFollowers: number = await prisma.user.count({ where: { following: { some: { id: parent.id } } } });
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
          where: { id: loggedInUser.id, following: { some: { id: parent.id } } },
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
      if (loggedInUser === null || parent.id !== loggedInUser.id) {
        return false;
      }
      return true;
    },
  },
};

export default resolvers;
