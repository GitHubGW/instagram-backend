import { User } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeFollowersArgs {
  username: string;
  cursor?: string;
}

interface SeeFollowersResult extends CommonResult {
  followers?: User[];
}

const resolvers: Resolvers = {
  Query: {
    seeFollowers: async (_, { username, cursor }: SeeFollowersArgs, { prisma }: Context): Promise<SeeFollowersResult> => {
      try {
        const countedUser: number = await prisma.user.count({ where: { username } });

        if (countedUser === 0) {
          return { ok: false, message: "존재하지 않는 유저입니다." };
        }

        const foundFollowers: User[] = await prisma.user.findUnique({ where: { username } }).followers({
          cursor: cursor === undefined ? undefined : { username: cursor },
          skip: cursor === undefined ? 0 : 1,
          take: 20,
        });
        return { ok: true, message: "팔로워 보기에 성공하였습니다.", followers: foundFollowers };
      } catch (error) {
        console.log("seeFollowers error");
        return { ok: false, message: "팔로워 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
