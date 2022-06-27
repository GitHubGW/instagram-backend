import { User } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface UnfollowUserArgs {
  username: string;
}

interface UnfollowUserResult extends CommonResult {
  user?: User;
}

const resolvers: Resolvers = {
  Mutation: {
    unfollowUser: async (_, { username }: UnfollowUserArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<UnfollowUserResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const foundUser: User | null = await prisma.user.findUnique({ where: { username } });

        if (foundUser === null) {
          return { ok: false, message: "존재하지 않는 유저입니다." };
        }

        await prisma.user.update({ where: { id: loggedInUser?.id }, data: { following: { disconnect: { username } } } });
        return { ok: true, message: "언팔로우에 성공하였습니다.", user: foundUser };
      } catch (error) {
        console.log("unfollowUser error");
        return { ok: false, message: "언팔로우에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
