import { Photo } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeFeedArgs {
  cursor?: number;
}

interface SeeFeedResult extends CommonResult {
  photos?: Photo[];
}

const resolvers: Resolvers = {
  Query: {
    seeFeed: async (_: any, { cursor }: SeeFeedArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<SeeFeedResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const foundPhotos: Photo[] = await prisma.photo.findMany({
          where: { user: { followers: { some: { id: loggedInUser?.id } } } },
          orderBy: { createdAt: "desc" },
          cursor: cursor === undefined ? undefined : { id: cursor },
          skip: cursor === undefined ? 0 : 1,
          take: 9,
        });

        return { ok: true, message: "피드 보기에 성공하였습니다.", photos: foundPhotos };
      } catch (error) {
        console.log("seeFeed error");
        return { ok: false, message: "피드 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
