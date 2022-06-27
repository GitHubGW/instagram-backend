import { Like, User } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeePhotoLikesArgs {
  photoId: number;
  cursor?: string;
}

interface SeePhotoLikesResult extends CommonResult {
  users?: User[];
}

const resolvers: Resolvers = {
  Query: {
    seePhotoLikes: async (_, { photoId, cursor }: SeePhotoLikesArgs, { prisma }: Context): Promise<SeePhotoLikesResult> => {
      try {
        const foundPhoto: number = await prisma.photo.count({ where: { id: photoId } });

        if (foundPhoto === 0) {
          return { ok: false, message: "존재하지 않는 사진입니다." };
        }

        const foundLikeUsers: User[] = await prisma.user.findMany({
          where: { likes: { some: { photoId } } },
          cursor: cursor === undefined ? undefined : { username: cursor },
          skip: cursor === undefined ? 0 : 1,
          take: 20,
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
