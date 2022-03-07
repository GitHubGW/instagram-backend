import { Hashtag, Like, Photo, User } from ".prisma/client";
import { Context, Resolvers } from "../types";

const resolvers: Resolvers = {
  Photo: {
    user: async (parent: Photo, args: any, { prisma }: Context): Promise<User | null> => {
      try {
        const foundUser: User | null = await prisma.user.findUnique({ where: { id: parent.userId } });

        if (foundUser === null) {
          throw new Error();
        }

        return foundUser;
      } catch (error) {
        console.log("user error");
        return null;
      }
    },
    hashtags: async (parent: Photo, args: any, { prisma }: Context): Promise<Hashtag[] | null> => {
      try {
        const foundHashtags: Hashtag[] = await prisma.photo.findUnique({ where: { id: parent.id } }).hashtags();
        return foundHashtags;
      } catch (error) {
        console.log("hashtags error");
        return null;
      }
    },
    totalLikes: async (parent: Photo, args: any, { prisma }: Context): Promise<number | null> => {
      try {
        const countedLikes: number = await prisma.like.count({ where: { photoId: parent.id } });
        return countedLikes;
      } catch (error) {
        console.log("totalLikes error");
        return null;
      }
    },
    totalComments: async (parent: Photo, args: any, { prisma }: Context): Promise<number | null> => {
      try {
        const countedComments: number = await prisma.comment.count({ where: { photoId: parent.id } });
        return countedComments;
      } catch (error) {
        console.log("totalComments error");
        return null;
      }
    },
    isMe: (parent: Photo, args: any, { loggedInUser }: Context): boolean => {
      const isMe: boolean = parent.userId === loggedInUser?.id;

      if (isMe === false) {
        return false;
      }
      return true;
    },
    isLiked: async (parent: Photo, args: any, { prisma, loggedInUser }: Context): Promise<boolean> => {
      try {
        if (loggedInUser === null) {
          return false;
        }

        const countedLike: number = await prisma.like.count({ where: { photoId: parent.id, userId: loggedInUser.id } });

        if (countedLike === 0) {
          return false;
        }

        return true;
      } catch (error) {
        console.log("isLiked error");
        return false;
      }
    },
  },
};

export default resolvers;
