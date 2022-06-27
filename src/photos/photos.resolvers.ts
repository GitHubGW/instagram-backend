import { Hashtag, Photo, User, Comment } from ".prisma/client";
import { Context, Resolvers } from "../types";

const resolvers: Resolvers = {
  Photo: {
    user: async (parent: Photo, __, { prisma }: Context): Promise<User | null> => {
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
    hashtags: async (parent: Photo, __, { prisma }: Context): Promise<Hashtag[] | null> => {
      try {
        const foundHashtags: Hashtag[] = await prisma.photo.findUnique({ where: { id: parent.id } }).hashtags();
        return foundHashtags;
      } catch (error) {
        console.log("hashtags error");
        return null;
      }
    },
    comments: async (parent: Photo, __, { prisma }: Context): Promise<Comment[] | null> => {
      try {
        const foundComments: Comment[] = await await prisma.photo.findUnique({ where: { id: parent.id } }).comments({ include: { user: true } });
        return foundComments;
      } catch (error) {
        console.log("comments error");
        return null;
      }
    },
    totalLikes: async (parent: Photo, __, { prisma }: Context): Promise<number> => {
      try {
        const countedLikes: number = await prisma.like.count({ where: { photoId: parent.id } });
        return countedLikes;
      } catch (error) {
        console.log("totalLikes error");
        return 0;
      }
    },
    totalComments: async (parent: Photo, __, { prisma }: Context): Promise<number> => {
      try {
        const countedComments: number = await prisma.comment.count({ where: { photoId: parent.id } });
        return countedComments;
      } catch (error) {
        console.log("totalComments error");
        return 0;
      }
    },
    isMe: (parent: Photo, __, { loggedInUser }: Context): boolean => {
      const isMe: boolean = parent.userId === loggedInUser?.id;

      if (isMe === false) {
        return false;
      }
      return true;
    },
    isLiked: async (parent: Photo, __, { prisma, loggedInUser }: Context): Promise<boolean> => {
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
