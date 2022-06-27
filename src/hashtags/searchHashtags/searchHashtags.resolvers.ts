import { Hashtag } from ".prisma/client";
import { Context, Resolvers } from "../../types";
import { CommonResult } from "../../shared/shared.interfaces";

interface SearchHashtagsArgs {
  name: string;
}

interface SearchHashtagsResult extends CommonResult {
  hashtags?: Hashtag[];
}

const resolvers: Resolvers = {
  Query: {
    searchHashtags: async (_, { name }: SearchHashtagsArgs, { prisma }: Context): Promise<SearchHashtagsResult> => {
      try {
        const foundHashtags: Hashtag[] = await prisma.hashtag.findMany({
          where: { name: { contains: name.toLowerCase() } },
        });

        return { ok: true, message: "해시테그 검색에 성공하였습니다.", hashtags: foundHashtags };
      } catch (error) {
        console.log("searchHashtags error");
        return { ok: false, message: "해시테그 검색에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
