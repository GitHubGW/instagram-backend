import * as bcrypt from "bcrypt";
import { User } from ".prisma/client";
import prisma from "../prisma";
import jwt from "jsonwebtoken";

interface CreateAccountArgs {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface LoginArgs {
  username: string;
  password: string;
}

export default {
  Mutation: {
    createAccount: async (_: any, { name, username, email, password }: CreateAccountArgs): Promise<User | null> => {
      try {
        const foundUser: User | null = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } });

        if (foundUser) {
          throw new Error("이미 존재하는 이메일 또는 유저명입니다.");
        }

        const hashedPassword: string = await bcrypt.hash(password, 10);
        const createdUser: User = await prisma.user.create({ data: { name, username, email, password: hashedPassword } });
        return createdUser;
      } catch (error) {
        console.log("createAccount error");
        return null;
      }
    },

    login: async (_: any, { username, password }: LoginArgs) => {
      try {
        const foundUser: User | null = await prisma.user.findFirst({ where: { username } });

        if (foundUser === null) {
          return { ok: false, message: "존재하지 않는 유저입니다." };
        }

        const isPasswordMatch: boolean = await bcrypt.compare(password, foundUser.password);

        if (isPasswordMatch === false) {
          return { ok: false, message: "잘못된 비밀번호입니다." };
        }

        const token: string = await jwt.sign({ userId: foundUser.id, username: foundUser.username, email: foundUser.email }, process.env.JWT_SECRET_KEY as string, {
          expiresIn: 100,
        });
        return { ok: true, message: "로그인에 성공하였습니다.", token };
      } catch (error) {
        console.log("login error");
        return { ok: false, message: "로그인에 실패하였습니다." };
      }
    },
  },
};
