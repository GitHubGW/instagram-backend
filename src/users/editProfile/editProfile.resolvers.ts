import * as bcrypt from "bcrypt";
import { Context, Resolvers } from "../../types";

interface EditProfileArgs {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
}

interface EditProfileResult {
  ok: boolean;
  message: string;
}

const resolvers: Resolvers = {
  Mutation: {
    editProfile: async (_: any, { name, username, email, password }: EditProfileArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<EditProfileResult> => {
      try {
        handleCheckLogin(loggedInUser);
        let hashedPassword: string | undefined = undefined;

        if (password !== undefined) {
          hashedPassword = await bcrypt.hash(password, 10);
        }

        await prisma.user.update({ where: { id: loggedInUser?.id }, data: { name, username, email, password: hashedPassword } });
        return { ok: true, message: "프로필 업데이트에 성공하였습니다." };
      } catch (error) {
        console.log("editProfile error");
        return { ok: false, message: "프로필 업데이트에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
