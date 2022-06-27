import { User } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeFollowingArgs {
  username: string;
  cursor?: string;
}

interface SeeFollowingResult extends CommonResult {
  following?: User[];
}

const resolvers: Resolvers = {
  Query: {
    seeFollowing: async (_, { username, cursor }: SeeFollowingArgs, { prisma }: Context): Promise<SeeFollowingResult> => {
      try {
        const countedUser: number = await prisma.user.count({ where: { username } });

        if (countedUser === 0) {
          return { ok: false, message: "존재하지 않는 유저입니다." };
        }

        const foundFollowing: User[] = await prisma.user.findUnique({ where: { username } }).following({
          cursor: cursor === undefined ? undefined : { username: cursor },
          skip: cursor === undefined ? 0 : 1,
          take: 20,
        });
        return { ok: true, message: "팔로우 보기에 성공하였습니다.", following: foundFollowing };
      } catch (error) {
        console.log("seeFollowing error");
        return { ok: false, message: "팔로우 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
