import * as bcrypt from "bcrypt";
import { User } from ".prisma/client";
import { Context, Resolvers } from "../../types";
import { CommonResult } from "../../shared/shared.interfaces";

interface CreateAccountArgs {
  name: string;
  username: string;
  email: string;
  password: string;
}

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (_, { name, username, email, password }: CreateAccountArgs, { prisma }: Context): Promise<CommonResult> => {
      try {
        const foundUser: User | null = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });

        if (foundUser) {
          return { ok: false, message: "이미 존재하는 이메일 또는 유저명입니다." };
        }

        const hashedPassword: string = await bcrypt.hash(password, 10);
        await prisma.user.create({ data: { name, username, email, password: hashedPassword } });
        return { ok: true, message: "계정 생성에 성공하였습니다." };
      } catch (error) {
        console.log("createAccount error");
        return { ok: false, message: "계정 생성에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
