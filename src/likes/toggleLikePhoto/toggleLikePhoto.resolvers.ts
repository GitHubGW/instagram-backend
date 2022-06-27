import pubsub from "../../pubsub";
import { Like, Photo } from ".prisma/client";
import { CommonResult } from "../../shared/shared.interfaces";
import { Context, Resolvers } from "../../types";

interface ToggleLikePhotoArgs {
  photoId: number;
}

const resolvers: Resolvers = {
  Mutation: {
    toggleLikePhoto: async (_, { photoId }: ToggleLikePhotoArgs, { prisma, loggedInUser, handleCheckLogin }: Context): Promise<CommonResult> => {
      try {
        handleCheckLogin(loggedInUser);

        const foundPhoto: Photo | null = await prisma.photo.findFirst({ where: { id: photoId } });

        if (foundPhoto === null) {
          return { ok: false, message: "존재하지 않는 사진입니다." };
        }

        const foundLike: Like | null = await prisma.like.findUnique({ where: { photoId_userId: { photoId, userId: loggedInUser?.id as number } } });

        if (foundLike) {
          await prisma.like.delete({ where: { photoId_userId: { photoId, userId: loggedInUser?.id as number } } });
          return { ok: true, message: "사진 '좋아요 취소'에 성공하였습니다." };
        }

        const createdLike: Like = await prisma.like.create({
          data: {
            photo: { connect: { id: photoId } },
            user: { connect: { id: loggedInUser?.id } },
          },
          include: { photo: true, user: true },
        });
        pubsub.publish("LIKE_UPDATES", { likeUpdates: createdLike });
        return { ok: true, message: "사진 '좋아요'에 성공하였습니다." };
      } catch (error) {
        console.log("likePhoto error");
        return { ok: false, message: "사진 '좋아요'에 실패하였습니다." };
      }
    },
  },
};

export default resolvers;
