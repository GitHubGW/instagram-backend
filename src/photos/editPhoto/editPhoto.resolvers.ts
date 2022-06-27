import { Photo } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";
import { handleExtractHashtags } from "../photos.utils";

interface EditPhotoArgs {
  photoId: number;
  caption: string;
}

const resolvers: Resolvers = {
  Mutation: {
    editPhoto: async (_, { photoId, caption }: EditPhotoArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<CommonResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const foundPhoto: (Photo & { hashtags: { name: string }[] }) | null = await prisma.photo.findFirst({
          where: { id: photoId, userId: loggedInUser?.id },
          include: { hashtags: { select: { name: true } } },
        });

        if (foundPhoto === null) {
          return { ok: false, message: "존재하지 않는 사진입니다." };
        }

        await prisma.photo.update({
          where: { id: photoId },
          data: {
            caption,
            hashtags: {
              disconnect: foundPhoto.hashtags,
              connectOrCreate: handleExtractHashtags(caption),
            },
          },
        });

        return { ok: true, message: "사진 수정에 성공하였습니다.", id: foundPhoto.id };
      } catch (error) {
        console.log("editPhoto error");
        return { ok: false, message: "사진 수정에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
