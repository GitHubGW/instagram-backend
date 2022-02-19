import { Like, User } from ".prisma/client";
import { Context, Resolvers } from "../../types";

interface SeePhotoLikesArgs {
  photoId: number;
  cursor?: string;
}

interface SeePhotoLikesResult {
  ok: boolean;
  message: string;
  users?: User[];
}

const resolvers: Resolvers = {
  Query: {
    seePhotoLikes: async (_: any, { photoId, cursor }: SeePhotoLikesArgs, { prisma }: Context): Promise<SeePhotoLikesResult> => {
      try {
        const foundLikeUsers: User[] = await prisma.user.findMany({
          where: { likes: { some: { photoId } } },
          cursor: cursor === undefined ? undefined : { username: cursor },
          skip: cursor === undefined ? 0 : 1,
          take: 5,
        });
        return { ok: true, message: "사진 '좋아요' 유저 보기에 성공하였습니다.", users: foundLikeUsers };
      } catch (error) {
        console.log("seePhotoLikes error");
        return { ok: false, message: "사진 '좋아요' 유저 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
