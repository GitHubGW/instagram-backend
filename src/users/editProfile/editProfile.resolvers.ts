import * as bcrypt from "bcrypt";
import { createWriteStream, ReadStream, WriteStream } from "fs";
import { finished } from "stream/promises";
import { Context, Resolvers } from "../../types";

interface EditProfileArgs {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  avatar?: any;
}

interface EditProfileResult {
  ok: boolean;
  message: string;
}

interface AvatarFile {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => ReadStream;
}

const resolvers: Resolvers = {
  Mutation: {
    editProfile: async (
      _: any,
      { name, username, email, password, bio, avatar }: EditProfileArgs,
      { prisma, loggedInUser, handleCheckLogin }: Context
    ): Promise<EditProfileResult> => {
      try {
        handleCheckLogin(loggedInUser);

        let hashedPassword: string | undefined = undefined;
        let avatarUrl: string | undefined = undefined;

        if (avatar) {
          const { filename, createReadStream }: AvatarFile = await avatar.file;
          const newFilename: string = `${loggedInUser?.username}-${Date.now()}-${filename}`;
          const readStream: ReadStream = createReadStream();
          const writeStream: WriteStream = createWriteStream(`${process.cwd()}/uploads/${newFilename}`);
          readStream.pipe(writeStream);
          avatarUrl = `http://localhost:${process.env.PORT}/uploads/${newFilename}`;
          await finished(writeStream);
        }
        if (password !== undefined) {
          hashedPassword = await bcrypt.hash(password, 10);
        }

        await prisma.user.update({ where: { id: loggedInUser?.id }, data: { name, username, email, password: hashedPassword, bio, avatarUrl } });
        return { ok: true, message: "프로필 업데이트에 성공하였습니다." };
      } catch (error) {
        console.log("editProfile error");
        return { ok: false, message: "프로필 업데이트에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
