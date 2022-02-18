import { Photo } from ".prisma/client";
import { Context, Resolvers } from "../../types";
import { ConnectOrCreate, handleExtractHashtags } from "../photos.utils";

interface UploadPhotoArgs {
  photo: any;
  caption?: string;
}

interface UploadPhotoResult {
  ok: boolean;
  message: string;
  photo?: Photo;
}

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: async (_: any, { photo, caption }: UploadPhotoArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<UploadPhotoResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const createdPhoto: Photo = await prisma.photo.create({
          data: {
            photoUrl: "test",
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
