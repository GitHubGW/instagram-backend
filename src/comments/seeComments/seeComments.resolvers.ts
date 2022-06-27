import { Comment } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeCommentsArgs {
  photoId: number;
  cursor?: number;
}

interface SeeCommentsResult extends CommonResult {
  comments?: Comment[];
}

const resolvers: Resolvers = {
  Query: {
    seeComments: async (_, { photoId, cursor }: SeeCommentsArgs, { prisma }: Context): Promise<SeeCommentsResult> => {
      try {
        const countedPhoto: number = await prisma.photo.count({ where: { id: photoId } });

        if (countedPhoto === 0) {
          return { ok: false, message: "존재하지 않는 사진입니다." };
        }

        const foundComments: Comment[] = await prisma.comment.findMany({
          where: { photoId },
          include: { user: true },
          orderBy: { createdAt: "desc" },
          cursor: cursor === undefined ? undefined : { id: cursor },
          skip: cursor === undefined ? 0 : 1,
          take: 15,
        });

        return { ok: true, message: "댓글 보기에 성공하였습니다.", comments: foundComments };
      } catch (error) {
        console.log("seeComments error");
        return { ok: false, message: "댓글 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
