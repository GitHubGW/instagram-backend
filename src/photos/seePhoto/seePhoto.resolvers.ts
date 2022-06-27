import { Photo } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface SeePhotoArgs {
  photoId: number;
}

interface SeePhotoResult extends CommonResult {
  photo?: Photo;
}

const resolvers: Resolvers = {
  Query: {
    seePhoto: async (_, { photoId }: SeePhotoArgs, { prisma }: Context): Promise<SeePhotoResult> => {
      try {
        const foundPhoto: Photo | null = await prisma.photo.findUnique({ where: { id: photoId } });

        if (foundPhoto === null) {
          return { ok: false, message: "존재하지 않는 사진입니다." };
        }

        return { ok: true, message: "사진 보기에 성공하였습니다.", photo: foundPhoto };
      } catch (error) {
        console.log("seePhoto error");
        return { ok: false, message: "사진 보기에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
