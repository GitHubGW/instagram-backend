import { Photo, User } from ".prisma/client";
import { Context, Resolvers } from "../types";

interface UsersPhotosArgs {
  cursor?: number;
}

const resolvers: Resolvers = {
  User: {
    photos: async (parent: User, { cursor }: UsersPhotosArgs, { prisma }: Context): Promise<Photo[] | null> => {
      try {
        /*         
        const foundPhotos: Photo[] = await prisma.photo.findMany({
          where: { userId: parent.id },
          orderBy: { createdAt: "desc" },
          cursor: cursor === undefined ? undefined : { id: cursor },
          skip: cursor === undefined ? 0 : 1,
          take: 9,
        }); 
        */
        const foundPhotos: Photo[] = await prisma.photo.findMany({
          where: { userId: parent.id },
          orderBy: { createdAt: "desc" },
        });
        return foundPhotos;
      } catch (error) {
        console.log("photos error");
        return null;
      }
    },
    totalFollowing: async (parent: User, args, { prisma }: Context): Promise<number> => {
      try {
        const countedFollowing: number = await prisma.user.count({ where: { followers: { some: { id: parent.id } } } });
        return countedFollowing;
      } catch (error) {
        console.log("totalFollowing error");
        return 0;
      }
    },
    totalFollowers: async (parent: User, args, { prisma }: Context): Promise<number> => {
      try {
        const countedFollowers: number = await prisma.user.count({ where: { following: { some: { id: parent.id } } } });
        return countedFollowers;
      } catch (error) {
        console.log("totalFollowers error");
        return 0;
      }
    },
    totalPhotos: async (parent: User, args, { prisma }: Context): Promise<number> => {
      try {
        const countedPhotos: number = await prisma.photo.count({ where: { userId: parent.id } });
        return countedPhotos;
      } catch (error) {
        console.log("totalPhotos error");
        return 0;
      }
    },
    isFollowing: async (parent: User, args, { prisma, loggedInUser }: Context): Promise<boolean> => {
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
    isMe: (parent: User, args, { loggedInUser }: Context): boolean => {
      if (loggedInUser === null || parent.id !== loggedInUser.id) {
        return false;
      }
      return true;
    },
  },
};

export default resolvers;
