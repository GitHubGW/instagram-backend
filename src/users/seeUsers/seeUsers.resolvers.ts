import { User } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeUsersResult extends CommonResult {
  users: User[];
}

const resolvers: Resolvers = {
  Query: {
    seeUsers: async (_, __, { prisma }: Context): Promise<SeeUsersResult> => {
      try {
        const foundUsers: User[] = await prisma.user.findMany({ include: { following: true, followers: true } });
        return { ok: true, message: "전체 유저 보기에 성공하였습니다.", users: foundUsers };
      } catch (error) {
        console.log("seeUsers error");
        return { ok: false, message: "전체 유저 보기에 실패하였습니다.", users: [] };
      }
    },
  },
};

export default resolvers;
