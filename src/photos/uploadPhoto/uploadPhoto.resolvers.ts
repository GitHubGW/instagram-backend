import { Photo } from ".prisma/client";
import { Context, Resolvers } from "../../types";

interface UploadPhotoArgs {
  photo: any;
  caption?: string;
}

interface UploadPhotoResult {
  ok: boolean;
  message: string;
  photo?: Photo;
}

interface ConnectOrCreate {
  where: { name: string };
  create: { name: string };
}

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: async (_: any, { photo, caption }: UploadPhotoArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<UploadPhotoResult> => {
      try {
        handleCheckLogin(loggedInUser);

        let connectOrCreateArray: ConnectOrCreate[] | undefined = undefined;

        if (caption) {
          const matchedHashtags: RegExpMatchArray | null = caption?.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g);
          const matchedUsers: RegExpMatchArray | null = caption?.match(/@[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g);
          connectOrCreateArray = matchedHashtags?.map((hashtag: string) => ({ where: { name: hashtag }, create: { name: hashtag } }));
        }

        const createdPhoto: Photo = await prisma.photo.create({
          data: {
            photoUrl: "test",
            caption,
            user: { connect: { username: loggedInUser?.username } },
            hashtags: { connectOrCreate: connectOrCreateArray },
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
