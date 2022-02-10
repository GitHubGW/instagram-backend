import * as bcrypt from "bcrypt";
import { User } from ".prisma/client";
import jwt from "jsonwebtoken";
import prisma from "../../prisma";

interface LoginArgs {
  username: string;
  password: string;
}

interface LoginResult {
  ok: boolean;
  message: string;
  token?: string;
}

export default {
  Mutation: {
    login: async (_: any, { username, password }: LoginArgs): Promise<LoginResult> => {
      try {
        const foundUser: User | null = await prisma.user.findFirst({ where: { username } });

        if (foundUser === null) {
          return { ok: false, message: "존재하지 않는 유저입니다." };
        }

        const isPasswordMatch: boolean = await bcrypt.compare(password, foundUser.password);

        if (isPasswordMatch === false) {
          return { ok: false, message: "잘못된 비밀번호입니다." };
        }

        const token: string = await jwt.sign({ userId: foundUser.id, username: foundUser.username }, process.env.JWT_SECRET_KEY as string, {
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
