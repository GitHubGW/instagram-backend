import { Hashtag, Photo } from ".prisma/client";
import { Context, Resolvers } from "../types";

interface HashtagsPhotosArgs {
  cursor?: number;
}

const resolvers: Resolvers = {
  Hashtag: {
    photos: async (parent: Hashtag, { cursor }: HashtagsPhotosArgs, { prisma }: Context): Promise<Photo[] | null> => {
      try {
        const foundPhotos: Photo[] = await prisma.photo.findMany({
          where: { hashtags: { some: { name: parent.name } } },
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
    totalPhotos: async (parent: Hashtag, args: any, { prisma }: Context): Promise<number | null> => {
      try {
        const countedPhotos: number = await prisma.photo.count({ where: { hashtags: { some: { name: parent.name } } } });
        return countedPhotos;
      } catch (error) {
        console.log("totalPhotos error");
        return null;
      }
    },
  },
};

export default resolvers;