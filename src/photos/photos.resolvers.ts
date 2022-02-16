import { Hashtag, Photo, User } from ".prisma/client";
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
  },
};

export default resolvers;
