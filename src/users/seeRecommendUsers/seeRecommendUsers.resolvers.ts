import { User } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeRecommendUsersResult extends CommonResult {
  users: User[];
}

const resolvers: Resolvers = {
  Query: {
    seeRecommendUsers: async (_, __, { prisma, loggedInUser }: Context): Promise<SeeRecommendUsersResult> => {
      try {
        const foundUsers: User[] = await prisma.user.findMany({ where: { NOT: { id: loggedInUser?.id } }, take: 5 });
        return { ok: true, message: "추천 사용자 보기에 성공하였습니다.", users: foundUsers };
      } catch (error) {
        console.log("seeRecommendUsers error");
        return { ok: false, message: "추천 사용자 보기에 실패하였습니다.", users: [] };
      }
    },
  },
};

export default resolvers;
