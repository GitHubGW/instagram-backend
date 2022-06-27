import { User } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeeProfileResult extends CommonResult {
  user?: User;
}

const resolvers: Resolvers = {
  Query: {
    seeMe: async (_, __, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<SeeProfileResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const foundUser: User | null = await prisma.user.findUnique({ where: { id: loggedInUser?.id } });

        if (foundUser === null) {
          throw new Error();
        }

        return { ok: true, message: "로그인한 사용자 보기에 성공하였습니다.", user: foundUser };
      } catch (error) {
        console.log("seeMe error");
        return { ok: false, message: "로그인한 사용자 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
