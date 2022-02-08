import * as bcrypt from "bcrypt";
import { User } from ".prisma/client";
import prisma from "../prisma";

interface CreateAccountArgs {
  name: string;
  username: string;
  email: string;
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
  },
};
