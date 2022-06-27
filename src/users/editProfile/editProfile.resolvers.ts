import * as bcrypt from "bcrypt";
import { User } from ".prisma/client";
import { createWriteStream, ReadStream, WriteStream } from "fs";
import { finished } from "stream/promises";
import { AvatarFile, CommonResult } from "../../shared/shared.interfaces";
import { handleDeleteFileFromS3, handleUploadFileToS3 } from "../../shared/shared.utils";
import { Context, Resolvers } from "../../types";

interface EditProfileArgs {
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  bio?: string;
  avatar?: any;
}

const resolvers: Resolvers = {
  Mutation: {
    editProfile: async (_, { name, username, email, password, bio, avatar }: EditProfileArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<CommonResult> => {
      try {
        handleCheckLogin(loggedInUser);

        let hashedPassword: string | undefined = undefined;
        let avatarUrl: string | undefined = undefined;
        const foundUser: User | null = await prisma.user.findUnique({ where: { id: loggedInUser?.id } });

        // 개발 환경에서 파일 업로드
        if (process.env.NODE_ENV === "development" && avatar) {
          const { filename, createReadStream }: AvatarFile = avatar.file;
          const newFilename: string = `${Date.now()}-${filename}`;
          const readStream: ReadStream = createReadStream();
          const writeStream: WriteStream = createWriteStream(`${process.cwd()}/uploads/${newFilename}`);
          readStream.pipe(writeStream);
          avatarUrl = `http://localhost:${process.env.PORT}/uploads/${newFilename}`;
          await finished(writeStream);
        }

        // 배포 환경에서 파일 업로드
        if (process.env.NODE_ENV !== "development" && avatar) {
          if (foundUser && foundUser.avatarUrl !== null) {
            await handleDeleteFileFromS3(foundUser.avatarUrl);
          }
          avatarUrl = await handleUploadFileToS3(avatar, "avatars", loggedInUser?.username as string);
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
