import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from ".prisma/client";
import { Context, Resolvers } from "../../types";
import { CommonResult } from "../../shared/shared.interfaces";

interface LoginArgs {
  username: string;
  password: string;
}

interface LoginResult extends CommonResult {
  token?: string;
}

const resolvers: Resolvers = {
  Mutation: {
    login: async (_, { username, password }: LoginArgs, { prisma }: Context): Promise<LoginResult> => {
      try {
        const foundUser: User | null = await prisma.user.findFirst({ where: { username } });

        if (foundUser === null) {
          return { ok: false, message: "존재하지 않는 계정입니다." };
        }

        const isPasswordMatch: boolean = await bcrypt.compare(password, foundUser.password);

        if (isPasswordMatch === false) {
          return { ok: false, message: "잘못된 비밀번호입니다." };
        }

        const token: string = await jwt.sign({ id: foundUser.id, username: foundUser.username }, process.env.JWT_SECRET_KEY as string, {
          expiresIn: "14d",
        });
        return { ok: true, message: "로그인에 성공하였습니다.", token };
      } catch (error) {
        console.log("login error");
        return { ok: false, message: "로그인에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
