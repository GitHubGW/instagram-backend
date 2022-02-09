import { User } from ".prisma/client";
import prisma from "../../prisma";

interface SeeProfileArgs {
  username: string;
}

interface SeeProfileResult {
  ok: boolean;
  message: string;
  user?: User;
}

export default {
  Query: {
    seeProfile: async (_: any, { username }: SeeProfileArgs): Promise<SeeProfileResult> => {
      try {
        const foundUser: User | null = await prisma.user.findUnique({ where: { username } });

        if (foundUser === null) {
          return { ok: false, message: "존재하지 않는 유저입니다." };
        }

        return { ok: true, message: "프로필 보기에 성공하였습니다.", user: foundUser };
      } catch (error) {
        console.log("seeProfile error");
        return { ok: false, message: "프로필 보기에 실패하였습니다." };
      }
    },
  },
};
