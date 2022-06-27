import { Photo } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { handleDeleteFileFromS3 } from "../../shared/shared.utils";
import { Context, Resolvers } from "../../types";

interface DeletePhotoArgs {
  photoId: number;
}

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: async (_, { photoId }: DeletePhotoArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<CommonResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const foundPhoto: Photo | null = await prisma.photo.findFirst({ where: { id: photoId, userId: loggedInUser?.id } });

        if (foundPhoto === null) {
          return { ok: false, message: "존재하지 않는 사진입니다." };
        }
        if (process.env.NODE_ENV !== "development") {
          handleDeleteFileFromS3(foundPhoto.photoUrl);
        }

        await prisma.photo.delete({ where: { id: photoId } });
        return { ok: true, message: "사진 삭제에 성공하였습니다.", id: foundPhoto.id };
      } catch (error) {
        console.log("deletePhoto error");
        return { ok: false, message: "사진 삭제에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
