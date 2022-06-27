import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface DeleteAccountArgs {
  userId: number;
}

const resolvers: Resolvers = {
  Mutation: {
    deleteAccount: async (_, { userId }: DeleteAccountArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<CommonResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const countedUser: number = await prisma.user.count({ where: { id: userId, username: loggedInUser?.username } });

        if (countedUser === 0) {
          return { ok: false, message: "존재하지 않는 계정입니다." };
        }

        await prisma.user.delete({ where: { id: loggedInUser?.id } });
        return { ok: true, message: "계정 생성에 성공하였습니다." };
      } catch (error) {
        console.log("deleteAccount error");
        return { ok: false, message: "계정 생성에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
