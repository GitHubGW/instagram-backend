import { Photo } from ".prisma/client";
import { createWriteStream, ReadStream, WriteStream } from "fs";
import { finished } from "stream/promises";
import { AvatarFile, CommonResult } from "../../shared/shared.interfaces";
import { handleUploadFileToS3 } from "../../shared/shared.utils";
import { Context, Resolvers } from "../../types";
import { handleExtractHashtags } from "../photos.utils";

interface UploadPhotoArgs {
  photo: any;
  caption?: string;
}

interface UploadPhotoResult extends CommonResult {
  photo?: Photo;
}

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: async (_, { photo, caption }: UploadPhotoArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<UploadPhotoResult> => {
      try {
        handleCheckLogin(loggedInUser);

        let photoUrl: string = "";

        // 개발 환경에서 파일 업로드
        if (process.env.NODE_ENV === "development" && photo) {
          const { filename, createReadStream }: AvatarFile = photo.file;
          const newFilename: string = `${Date.now()}-${filename}`;
          const readStream: ReadStream = createReadStream();
          const writeStream: WriteStream = createWriteStream(`${process.cwd()}/uploads/${newFilename}`);
          readStream.pipe(writeStream);
          photoUrl = `http://localhost:${process.env.PORT}/uploads/${newFilename}`;
          await finished(writeStream);
        }

        // 배포 환경에서 파일 업로드
        if (process.env.NODE_ENV !== "development" && photo) {
          photoUrl = await handleUploadFileToS3(photo, "photos", loggedInUser?.username as string);
        }

        const createdPhoto: Photo = await prisma.photo.create({
          data: {
            photoUrl,
            caption,
            user: { connect: { username: loggedInUser?.username } },
            hashtags: { connectOrCreate: caption === undefined ? undefined : handleExtractHashtags(caption) },
          },
        });
        return { ok: true, message: "사진 업로드에 성공하였습니다.", photo: createdPhoto };
      } catch (error) {
        console.log("uploadPhoto error");
        return { ok: false, message: "사진 업로드에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
