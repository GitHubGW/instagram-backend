import { Hashtag } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeHashtagArgs {
  name: string;
}

interface SeeHashtagResult extends CommonResult {
  hashtag?: Hashtag;
}

const resolvers: Resolvers = {
  Query: {
    seeHashtag: async (_, { name }: SeeHashtagArgs, { prisma }: Context): Promise<SeeHashtagResult> => {
      try {
        const foundHashtag: Hashtag | null = await prisma.hashtag.findUnique({ where: { name } });

        if (foundHashtag === null) {
          return { ok: false, message: "존재하지 않는 해시태그입니다." };
        }

        return { ok: true, message: "해시태그 보기에 성공하였습니다.", hashtag: foundHashtag };
      } catch (error) {
        console.log("seeHashtag error");
        return { ok: false, message: "해시태그 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
