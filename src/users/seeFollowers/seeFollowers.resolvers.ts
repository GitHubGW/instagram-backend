import { User } from ".prisma/client";
import { Context, Resolvers } from "../../types";

interface SeeFollowersArgs {
  username: string;
  page: number;
}

interface SeeFollowersResult {
  ok: boolean;
  message: string;
  followers?: User[];
  totalPages?: number;
}

const resolvers: Resolvers = {
  Query: {
    seeFollowers: async (_: any, { username, page }: SeeFollowersArgs, { prisma }: Context): Promise<SeeFollowersResult> => {
      try {
        const foundUser: number = await prisma.user.count({ where: { username } });

        if (foundUser === 0) {
          return { ok: false, message: "존재하지 않는 유저입니다." };
        }

        const foundFollowers: User[] = await prisma.user.findUnique({ where: { username } }).followers({
          skip: (page - 1) * 5,
          take: 5,
        });
        const totalFollowers: number = await prisma.user.count({ where: { following: { some: { username } } } });
        return { ok: true, message: "팔로워 보기에 성공하였습니다.", followers: foundFollowers, totalPages: Math.ceil(totalFollowers / 5) };
      } catch (error) {
        console.log("seeFollowers error");
        return { ok: false, message: "팔로워 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
