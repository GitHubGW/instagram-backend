import { Photo } from ".prisma/client";
import { Context, Resolvers } from "../../types";

interface DeletePhotoArgs {
  photoId: number;
}

interface DeletePhotoResult {
  ok: boolean;
  message: string;
}

const resolvers: Resolvers = {
  Mutation: {
    deletePhoto: async (_: any, { photoId }: DeletePhotoArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<DeletePhotoResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const countedPhoto: number = await prisma.photo.count({ where: { id: photoId, userId: loggedInUser?.id } });

        if (countedPhoto === 0) {
          return { ok: false, message: "존재하지 않는 사진입니다." };
        }

        await prisma.photo.delete({ where: { id: photoId } });
        return { ok: true, message: "사진 삭제에 성공하였습니다." };
      } catch (error) {
        console.log("deletePhoto error");
        return { ok: false, message: "사진 삭제에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
